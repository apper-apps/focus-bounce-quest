import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion'
import { getEnemyStyle, getEnemyIcon } from '@/utils/enemyHelpers'
import Ball from "@/components/atoms/Ball";

const GameCanvas = ({ 
  level, 
  gameState, 
  onLevelComplete, 
  onGameOver, 
  onSleepUsed,
  onJump,
  onScore,
controls 
}) => {
  // Combat state
  const [combatState, setCombatState] = useState({
    active: false,
    enemy: null,
    playerHealth: 100,
    enemyHealth: 100,
    playerTurn: true
  });
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Game physics constants
  const GRAVITY = 0.5;
  const JUMP_FORCE = -12;
  const BALL_SIZE = 24;
  const GROUND_Y = dimensions.height - 100;

  // Initialize ball position
const [ballState, setBallState] = useState({
    x: 50,
    y: GROUND_Y - BALL_SIZE,
    velocityX: 2,
    velocityY: 0,
    isGrounded: false,
    isJumping: false,
    lastGroundTime: Date.now(),
    isReversed: false,
    baseSpeed: 2,
  });
  const [particles, setParticles] = useState([]);
  const [sleepActive, setSleepActive] = useState(false);

  // Update canvas dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Handle jump input
  const handleJump = useCallback(() => {
// Allow coyote time jumping (can jump shortly after leaving ground)
    const canJump = ballState.isGrounded || (Date.now() - ballState.lastGroundTime < 150);
    if (sleepActive || !canJump) return;
    
    setBallState(prev => ({
      ...prev,
      velocityY: JUMP_FORCE,
      isGrounded: false,
      isJumping: true,
    }));

    onJump?.();

    // Reset jumping animation
    setTimeout(() => {
      setBallState(prev => ({ ...prev, isJumping: false }));
    }, 200);
  }, [ballState.isGrounded, sleepActive, onJump]);

// Handle sleep input
  const handleSleep = useCallback(() => {
    if (gameState.sleepUsed || sleepActive || gameState.status !== "playing") return;

    setSleepActive(true);
    onSleepUsed?.();

    // Create sleep particles
    const sleepParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: ballState.x + Math.random() * 40,
      y: ballState.y + Math.random() * 40,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * -2,
      life: 1,
    }));
    setParticles(prev => [...prev, ...sleepParticles]);

    // Sleep lasts 2 seconds
    setTimeout(() => {
      setSleepActive(false);
    }, 2000);
  }, [gameState.sleepUsed, sleepActive, onSleepUsed, gameState.status, ballState.x, ballState.y]);

  // Handle reverse input
  const handleReverse = useCallback(() => {
    if (sleepActive || gameState.status !== "playing") return;
    
    setBallState(prev => ({
      ...prev,
      isReversed: !prev.isReversed,
      velocityX: prev.isReversed ? prev.baseSpeed : -prev.baseSpeed,
    }));

    // Create reverse particles
    const reverseParticles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: ballState.x + BALL_SIZE/2 + Math.random() * 20 - 10,
      y: ballState.y + BALL_SIZE/2 + Math.random() * 20 - 10,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      life: 1,
      color: '#60A5FA'
    }));
    setParticles(prev => [...prev, ...reverseParticles]);
  }, [sleepActive, gameState.status, ballState.x, ballState.y]);

// Set up controls
  useEffect(() => {
    if (controls) {
      controls.jump = handleJump;
      controls.sleep = handleSleep;
      controls.reverse = handleReverse;
    }
  }, [controls, handleJump, handleSleep, handleReverse]);

  // Collision detection
const checkCollisions = useCallback((newX, newY, currentVelocityY = 0) => {
    if (!level?.platforms) return { collision: false, type: null };

    // Check enemy collisions first
    if (level?.enemies && !combatState.active) {
      for (const enemy of level.enemies) {
        if (newX < enemy.x + enemy.width &&
            newX + BALL_SIZE > enemy.x &&
            newY < enemy.y + enemy.height &&
            newY + BALL_SIZE > enemy.y) {
          return { 
            collision: true, 
            type: "enemy", 
            enemy: enemy,
            x: enemy.x,
            y: enemy.y - BALL_SIZE
          };
        }
      }
    }

    // Check ground collision
    if (newY >= GROUND_Y - BALL_SIZE) {
      return { collision: true, type: "ground", y: GROUND_Y - BALL_SIZE };
    }

    // Check platform collisions
    for (const platform of level.platforms) {
      const ballLeft = newX;
      const ballRight = newX + BALL_SIZE;
      const ballTop = newY;
      const ballBottom = newY + BALL_SIZE;

      const platformLeft = platform.x;
      const platformRight = platform.x + platform.width;
      const platformTop = platform.y;
      const platformBottom = platform.y + platform.height;

      // Check if ball overlaps with platform
      if (
        ballRight > platformLeft &&
        ballLeft < platformRight &&
        ballBottom > platformTop &&
        ballTop < platformBottom
      ) {
        if (platform.type === "obstacle" && !sleepActive) {
          return { collision: true, type: "obstacle", platform };
        } else if (platform.type === "platform") {
          // Land on top of platform
          if (currentVelocityY > 0 && ballTop < platformTop) {
            return { 
              collision: true, 
              type: "platform", 
              y: platformTop - BALL_SIZE 
            };
          }
        }
      }
    }

    // Check portal collision
    if (level?.portal) {
      const portalDistance = Math.sqrt(
        Math.pow(newX + BALL_SIZE/2 - level.portal.x, 2) +
        Math.pow(newY + BALL_SIZE/2 - level.portal.y, 2)
      );
      
      if (portalDistance < 30) {
        return { collision: true, type: "portal" };
      }
    }

return { collision: false, type: null };
  }, [level, sleepActive, combatState.active]);

// Game loop
  useEffect(() => {
    if (gameState.status !== "playing" || combatState.active) return;

    gameLoopRef.current = setInterval(() => {
setBallState(prev => {
          let newX = prev.x;
          let newY = prev.y;
          let newVelocityX = prev.velocityX;
          let newVelocityY = prev.velocityY;
          let newIsGrounded = false;
          let newLastGroundTime = prev.lastGroundTime;
          let newIsReversed = prev.isReversed;

          // Don't move during sleep
          if (!sleepActive) {
            // Apply gravity
            newVelocityY += GRAVITY;
            
            // Update horizontal velocity based on reverse state
            newVelocityX = prev.isReversed ? -prev.baseSpeed : prev.baseSpeed;
            
            // Update position
            newX += newVelocityX;
            newY += newVelocityY;

            // Check boundaries - reverse direction when hitting walls
            if (newX < 0) {
              newX = 0;
              newIsReversed = false;
              newVelocityX = prev.baseSpeed;
            }
            if (newX > dimensions.width - BALL_SIZE) {
              newX = dimensions.width - BALL_SIZE;
              newIsReversed = true;
              newVelocityX = -prev.baseSpeed;
            }

            // Check collisions with current velocity
            const collision = checkCollisions(newX, newY, newVelocityY);
          
          if (collision.collision) {
            switch (collision.type) {
              case "ground":
              case "platform":
                newY = collision.y;
                newVelocityY = 0;
                newIsGrounded = true;
                newLastGroundTime = Date.now(); // Update ground time for reliable coyote jumping
                break;
              case "obstacle":
                // Create explosion particles
                const explosionParticles = Array.from({ length: 12 }, (_, i) => ({
                  id: Date.now() + i,
                  x: prev.x + 20,
                  y: prev.y + 20,
                  vx: (Math.random() - 0.5) * 8,
                  vy: (Math.random() - 0.5) * 8,
                  life: 1,
                  color: '#FF6B6B'
                }));
                setParticles(prevParticles => [...prevParticles, ...explosionParticles]);
                onGameOver?.();
                return prev;
              case "enemy":
                // Start combat
                setCombatState({
                  active: true,
                  enemy: collision.enemy,
                  playerHealth: 100,
                  enemyHealth: collision.enemy.health || 100,
                  playerTurn: true
                });
                // Position ball near enemy
                newX = collision.x;
                newY = collision.y;
                newVelocityX = 0;
                newVelocityY = 0;
                newIsGrounded = true;
                break;
              case "portal":
                onLevelComplete?.();
                return prev;
            }
          }

          // Fall off screen
          if (newY > dimensions.height + 100) {
            onGameOver?.();
            return prev;
          }
        }

return {
          ...prev,
          x: newX,
          y: newY,
          velocityX: newVelocityX,
          velocityY: newVelocityY,
          isGrounded: newIsGrounded,
          isReversed: newIsReversed,
          lastGroundTime: newLastGroundTime,
        };
      });
    }, 16); // ~60 FPS

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.status, dimensions, sleepActive, onLevelComplete, onGameOver, combatState.active]);

  // Combat controls
  controls.attack = useCallback(() => {
    if (combatState.active && combatState.playerTurn) {
      const damage = Math.floor(Math.random() * 30) + 20; // 20-50 damage
      setCombatState(prev => ({
        ...prev,
        enemyHealth: Math.max(0, prev.enemyHealth - damage),
        playerTurn: false
      }));
    }
  }, [combatState.active, combatState.playerTurn]);

  // Enemy turn and combat resolution
  useEffect(() => {
    if (!combatState.active) return;

    if (combatState.enemyHealth <= 0) {
      // Victory - remove enemy and continue
      const updatedLevel = {
        ...level,
        enemies: level.enemies.filter(e => e !== combatState.enemy)
      };
      onScore?.(50); // Bonus points for defeating enemy
      setCombatState({ active: false, enemy: null, playerHealth: 100, enemyHealth: 100, playerTurn: true });
      return;
    }

    if (combatState.playerHealth <= 0) {
      // Defeat - game over
      onGameOver?.();
      setCombatState({ active: false, enemy: null, playerHealth: 100, enemyHealth: 100, playerTurn: true });
      return;
    }

    if (!combatState.playerTurn) {
      // Enemy turn
      setTimeout(() => {
        const damage = Math.floor(Math.random() * 25) + 15; // 15-40 damage
        setCombatState(prev => ({
          ...prev,
          playerHealth: Math.max(0, prev.playerHealth - damage),
          playerTurn: true
        }));
      }, 1000);
    }
  }, [combatState, level, onScore, onGameOver]);

// Reset ball position when level changes or game restarts
// Reset ball position when level changes or game restarts
useEffect(() => {
    setBallState({
      x: 50,
      y: GROUND_Y - BALL_SIZE,
      velocityX: 2.5, // Slightly faster movement
      velocityY: 0,
      isGrounded: true,
      isJumping: false,
      lastGroundTime: Date.now(),
      isReversed: false,
      baseSpeed: 2.5,
    });
    setSleepActive(false);
    setParticles([]);
  }, [level, gameState.status, GROUND_Y, BALL_SIZE]);

  // Ball boundary detection - trigger game over if ball goes off screen
  useEffect(() => {
    if (gameState.status === "playing") {
      // Check if ball fell off the screen or went too far right
      if (ballState.y > dimensions.height + 100 || 
          ballState.x > dimensions.width + 100 || 
          ballState.x < -100) {
        onGameOver();
      }
    }
  }, [ballState.x, ballState.y, gameState.status, dimensions, onGameOver]);

  if (!level) return null;

  return (
    <div 
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden bg-gradient-to-b from-blue-900 via-purple-900 to-indigo-900"
      style={{
background: `linear-gradient(135deg, 
          ${level.backgroundTheme === "nature" ? "#FF8A65, #FFA726, #66BB6A, #2E7D32" :
            level.backgroundTheme === "forest" ? "#2D5016, #1A2E05" : 
            level.backgroundTheme === "lava" ? "#7C2D12, #431407" :
            level.backgroundTheme === "cyber" ? "#1E1B4B, #0F0A1F" :
            level.backgroundTheme === "galactic" ? "#1A237E, #0D47A1" :
            "#1E3A8A, #312E81"})`,
      }}
    >
      {/* Background Stars/Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Ground */}
      <div 
        className="absolute bottom-0 left-0 right-0 platform"
        style={{ height: 100 }}
      />

      {/* Level Platforms */}
      {level.platforms?.map((platform, index) => (
        <div
          key={index}
          className={platform.type === "obstacle" ? "obstacle" : "platform"}
          style={{
            position: "absolute",
            left: platform.x,
            top: platform.y,
            width: platform.width,
            height: platform.height,
          }}
        />
))}

      {/* Enemies */}
      {level?.enemies?.map((enemy, index) => (
        <motion.div
          key={`enemy-${index}`}
          className={`absolute ${getEnemyStyle(enemy.type)}`}
          style={{
            left: enemy.x,
            top: enemy.y,
            width: enemy.width,
            height: enemy.height,
          }}
          animate={{
            y: [0, -3, 0],
            scaleX: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
            {getEnemyIcon(enemy.type)}
          </div>
        </motion.div>
      ))}

      {/* Combat UI Overlay */}
      <AnimatePresence>
        {combatState.active && (
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-surface to-slate-700 rounded-xl p-6 max-w-md w-full mx-4 border border-white/20 text-white"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Trap Encounter!</h3>
                <p className="text-slate-300">{combatState.enemy?.name || 'Unknown Enemy'}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Your Health:</span>
                  <div className="flex-1 mx-3 bg-gray-600 rounded-full h-3 relative overflow-hidden">
                    <motion.div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${combatState.playerHealth}%` }}
                      animate={{ width: `${combatState.playerHealth}%` }}
                    />
                  </div>
                  <span>{combatState.playerHealth}/100</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Enemy Health:</span>
                  <div className="flex-1 mx-3 bg-gray-600 rounded-full h-3 relative overflow-hidden">
                    <motion.div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${combatState.enemyHealth}%` }}
                      animate={{ width: `${combatState.enemyHealth}%` }}
                    />
                  </div>
                  <span>{combatState.enemyHealth}/100</span>
                </div>
              </div>

              <div className="text-center">
                {combatState.playerTurn ? (
                  <motion.button
                    onClick={() => controls.attack?.()}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-8 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ⚔️ Attack!
                  </motion.button>
                ) : (
                  <div className="text-slate-300">Enemy is attacking...</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Portal */}
      {level.portal && (
        <motion.div
          className="portal absolute"
          style={{
            left: level.portal.x - 25,
            top: level.portal.y - 25,
            width: 50,
            height: 50,
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      )}

{/* Ball */}
      <Ball
        position={{ x: ballState.x, y: ballState.y }}
        isSleeping={sleepActive}
        isJumping={ballState.isJumping}
        isReversed={ballState.isReversed}
        size={BALL_SIZE}
      />
      
      {/* Update parent with ball state */}
{/* Particle System */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color || '#9333ea',
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ 
            opacity: 0, 
            scale: 0,
            x: particle.vx * 20,
            y: particle.vy * 20,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          onAnimationComplete={() => {
            setParticles(prev => prev.filter(p => p.id !== particle.id));
          }}
        />
      ))}

      {/* Sleep Effect Overlay */}
      <AnimatePresence>
        {sleepActive && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 pointer-events-none sleep-effect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Status Overlay */}
      {gameState.status === "paused" && (
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">PAUSED</h2>
            <p className="text-lg opacity-80">Press ESC or click pause to resume</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GameCanvas;