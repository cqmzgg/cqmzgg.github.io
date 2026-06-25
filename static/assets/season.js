(function() {
    // 等待页面加载完成
    window.addEventListener('DOMContentLoaded', function() {
        // ---------- 季节判断 ----------
        function getSeason() {
            const month = new Date().getMonth(); // 0-11
            if (month >= 2 && month <= 4) return 'spring';  // 3,4,5月
            if (month >= 5 && month <= 7) return 'summer';  // 6,7,8月
            if (month >= 8 && month <= 10) return 'autumn'; // 9,10,11月
            return 'winter'; // 12,1,2月
        }
        const SEASON = getSeason();

        // ---------- Canvas 设置 ----------
        const canvas = document.createElement('canvas');
        canvas.id = 'season-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '999';  // 置于最底层
        canvas.style.pointerEvents = 'none'; // 让点击穿透
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width, height;
        let animationId = null;
        let particles = [];

        // 更新画布尺寸
        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        window.addEventListener('resize', () => {
            resizeCanvas();
            // 重新初始化粒子（避免位置错位）
            initParticles();
        });

        // ---------- 各季节的参数 ----------
        let particleCount = 0;
        let particleColor = '';
        let particleSpeed = 1;
        let particleSize = 2;
        let customDraw = null; // 自定义绘制函数（用于落叶、太阳等）

        // 春天：斜向细雨
        function springDraw(particle) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle.x - particle.vx * 2, particle.y + particle.vy * 2);
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = particle.size;
            ctx.stroke();
        }
        function initSpring() {
            particleCount = 35;
            particleColor = 'rgba(100, 150, 255, 0.6)';
            particleSpeed = 5;
            particleSize = 1.5;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 1.5,  // 水平飘移
                    vy: 2 + Math.random() * 4,
                    size: 1 + Math.random() * 2,
                    color: `rgba(100, 150, 255, ${0.3 + Math.random() * 0.5})`
                });
            }
        }

        // 夏天：烈日 + 热浪光点
        let sunAngle = 0;
        function summerDraw(particle) {
            // 粒子是闪烁的光点
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        }
        function drawSun() {
            // 绘制太阳（固定左上角或右上角，这里放右上角）
            const sunX = width - 80;
            const sunY = 80;
            // 外光晕
            const gradient = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 50);
            gradient.addColorStop(0, 'rgba(255, 200, 50, 0.9)');
            gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(sunX, sunY, 50, 0, Math.PI * 2);
            ctx.fill();
            // 核心
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(sunX, sunY, 20, 0, Math.PI * 2);
            ctx.fill();
            // 光线旋转
            sunAngle += 0.02;
            for (let i = 0; i < 12; i++) {
                const angle = sunAngle + (i * Math.PI * 2 / 12);
                const dx = Math.cos(angle) * 35;
                const dy = Math.sin(angle) * 35;
                ctx.beginPath();
                ctx.moveTo(sunX + dx * 0.5, sunY + dy * 0.5);
                ctx.lineTo(sunX + dx, sunY + dy);
                ctx.lineWidth = 4;
                ctx.strokeStyle = `rgba(255, 200, 0, ${0.5 + Math.sin(angle * 3) * 0.3})`;
                ctx.stroke();
            }
        }
        function initSummer() {
            particleCount = 35;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: 0.2 + Math.random() * 0.8,
                    size: 2 + Math.random() * 4,
                    color: `rgba(255, 180, 50, ${0.4 + Math.random() * 0.5})`
                });
            }
        }

        // 秋天：落叶（旋转的椭圆）
        function autumnDraw(particle) {
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.angle);
            ctx.beginPath();
            ctx.ellipse(0, 0, particle.sizeX, particle.sizeY, 0, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            ctx.restore();
        }
        function initAutumn() {
            particleCount = 40;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: 1 + Math.random() * 2,
                    sizeX: 6 + Math.random() * 6,
                    sizeY: 3 + Math.random() * 4,
                    angle: Math.random() * Math.PI * 2,
                    angleSpeed: (Math.random() - 0.5) * 0.05,
                    color: `rgba(${150 + Math.random() * 80}, ${60 + Math.random() * 40}, ${20 + Math.random() * 30}, ${0.7 + Math.random() * 0.3})`
                });
            }
        }

        // 冬天：雪花
        function winterDraw(particle) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            // 偶尔加一点六角星的感觉（简化）
            if (particle.size > 2) {
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI * 2 / 6) + particle.angle;
                    const x2 = particle.x + Math.cos(angle) * particle.size * 0.8;
                    const y2 = particle.y + Math.sin(angle) * particle.size * 0.8;
                    ctx.lineTo(x2, y2);
                }
                ctx.closePath();
                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                ctx.fill();
            }
        }
        function initWinter() {
            particleCount = 80;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.6,
                    vy: 1 + Math.random() * 2.5,
                    size: 2 + Math.random() * 4,
                    angle: Math.random() * Math.PI * 2,
                    color: `rgba(255, 255, 255, ${0.6 + Math.random() * 0.4})`
                });
            }
        }

        // 根据季节选择初始化函数和绘制逻辑
        let updateParticle = null;
        let drawExtra = null;

        switch (SEASON) {
            case 'spring':
                initSpring();
                updateParticle = function(p) {
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < -20) p.x = width + 20;
                    if (p.x > width + 20) p.x = -20;
                    if (p.y > height + 20) {
                        p.y = -20;
                        p.x = Math.random() * width;
                    }
                    if (p.y < -20) p.y = height + 20;
                };
                customDraw = springDraw;
                drawExtra = null;
                break;
            case 'summer':
                initSummer();
                updateParticle = function(p) {
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < -20) p.x = width + 20;
                    if (p.x > width + 20) p.x = -20;
                    if (p.y > height + 20) {
                        p.y = -20;
                        p.x = Math.random() * width;
                    }
                    if (p.y < -20) p.y = height + 20;
                };
                customDraw = summerDraw;
                drawExtra = drawSun;
                break;
            case 'autumn':
                initAutumn();
                updateParticle = function(p) {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.angle += p.angleSpeed;
                    if (p.x < -30) p.x = width + 30;
                    if (p.x > width + 30) p.x = -30;
                    if (p.y > height + 30) {
                        p.y = -30;
                        p.x = Math.random() * width;
                    }
                    if (p.y < -30) p.y = height + 30;
                };
                customDraw = autumnDraw;
                drawExtra = null;
                break;
            case 'winter':
                initWinter();
                updateParticle = function(p) {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.angle += 0.02;
                    if (p.x < -10) p.x = width + 10;
                    if (p.x > width + 10) p.x = -10;
                    if (p.y > height + 10) {
                        p.y = -10;
                        p.x = Math.random() * width;
                    }
                    if (p.y < -10) p.y = height + 10;
                };
                customDraw = winterDraw;
                drawExtra = null;
                break;
        }

        // 动画循环
        function animate() {
            if (!canvas.isConnected) return; // 防止画布被移除后继续
            ctx.clearRect(0, 0, width, height);
            
            // 根据不同季节添加半透明背景拖尾效果（制造动态模糊）
            if (SEASON === 'summer') {
                ctx.fillStyle = 'rgba(255, 200, 100, 0.05)';
                ctx.fillRect(0, 0, width, height);
            } else if (SEASON === 'winter') {
                ctx.fillStyle = 'rgba(100, 150, 200, 0.08)';
                ctx.fillRect(0, 0, width, height);
            } else {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, width, height);
            }

            for (let p of particles) {
                updateParticle(p);
                if (customDraw) customDraw(p);
                else {
                    // fallback
                    ctx.fillStyle = particleColor;
                    ctx.fillRect(p.x, p.y, particleSize, particleSize);
                }
            }
            if (drawExtra) drawExtra();
            animationId = requestAnimationFrame(animate);
        }

        function initParticles() {
            // 重新初始化所有粒子（适应新尺寸）
            switch (SEASON) {
                case 'spring': initSpring(); break;
                case 'summer': initSummer(); break;
                case 'autumn': initAutumn(); break;
                case 'winter': initWinter(); break;
            }
        }

        resizeCanvas();
        initParticles();
        animate();

        // 页面可见性变化时暂停/恢复动画（节省资源）
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                if (animationId) cancelAnimationFrame(animationId);
                animationId = null;
            } else {
                if (!animationId) animate();
            }
        });
    });
})();

