// 3D Background Animation
        let scene, camera, renderer, particles, geometry;
        const particleCount = 2000;

        function init3DBackground() {
            const canvas = document.getElementById('bg-canvas');
            scene = new THREE.Scene();
            
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0);

            // Create particle geometry
            geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const sizes = new Float32Array(particleCount);

            // Create particles with varying positions and colors
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                // Position
                positions[i3] = (Math.random() - 0.5) * 100;
                positions[i3 + 1] = (Math.random() - 0.5) * 100;
                positions[i3 + 2] = (Math.random() - 0.5) * 100;
                
                // Colors (orange to red gradient like Porsche)
                const colorVariant = Math.random();
                colors[i3] = 1.0; // Red
                colors[i3 + 1] = 0.4 + colorVariant * 0.4; // Green (orange-red range)
                colors[i3 + 2] = 0.1; // Blue
                
                // Size
                sizes[i] = Math.random() * 2 + 0.5;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            // Create particle material
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 }
                },
                vertexShader: `
                    attribute float size;
                    attribute vec3 color;
                    varying vec3 vColor;
                    uniform float time;
                    
                    void main() {
                        vColor = color;
                        vec3 pos = position;
                        
                        // Add wave motion
                        pos.x += sin(time * 0.5 + position.y * 0.01) * 2.0;
                        pos.y += cos(time * 0.3 + position.x * 0.01) * 2.0;
                        pos.z += sin(time * 0.4 + position.x * 0.005 + position.y * 0.005) * 1.5;
                        
                        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                        gl_PointSize = size * (300.0 / -mvPosition.z);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    varying vec3 vColor;
                    
                    void main() {
                        float r = distance(gl_PointCoord, vec2(0.5, 0.5));
                        if (r > 0.5) discard;
                        
                        float alpha = 1.0 - (r * 2.0);
                        alpha = pow(alpha, 2.0);
                        
                        gl_FragColor = vec4(vColor, alpha * 0.8);
                    }
                `,
                transparent: true,
                vertexColors: true,
                blending: THREE.AdditiveBlending
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);

            // Add ambient lighting
            const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
            scene.add(ambientLight);

            // Create floating geometric shapes
            createFloatingShapes();

            camera.position.z = 30;
            
            // Start animation
            animate3D();
        }

        function createFloatingShapes() {
            // Create wireframe cubes
            const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
            const cubeMaterial = new THREE.MeshBasicMaterial({
                color: 0xff6b35,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });

            for (let i = 0; i < 8; i++) {
                const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                cube.position.set(
                    (Math.random() - 0.5) * 60,
                    (Math.random() - 0.5) * 60,
                    (Math.random() - 0.5) * 60
                );
                cube.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );
                cube.userData = {
                    rotationSpeed: {
                        x: (Math.random() - 0.5) * 0.02,
                        y: (Math.random() - 0.5) * 0.02,
                        z: (Math.random() - 0.5) * 0.02
                    }
                };
                scene.add(cube);
            }

            // Create wireframe spheres
            const sphereGeometry = new THREE.SphereGeometry(1.5, 16, 16);
            const sphereMaterial = new THREE.MeshBasicMaterial({
                color: 0xf7931e,
                wireframe: true,
                transparent: true,
                opacity: 0.4
            });

            for (let i = 0; i < 5; i++) {
                const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                sphere.position.set(
                    (Math.random() - 0.5) * 80,
                    (Math.random() - 0.5) * 80,
                    (Math.random() - 0.5) * 40
                );
                sphere.userData = {
                    rotationSpeed: {
                        x: (Math.random() - 0.5) * 0.015,
                        y: (Math.random() - 0.5) * 0.015,
                        z: (Math.random() - 0.5) * 0.015
                    }
                };
                scene.add(sphere);
            }
        }

        function animate3D() {
            requestAnimationFrame(animate3D);

            const time = Date.now() * 0.001;

            // Update particle shader time
            if (particles && particles.material && particles.material.uniforms) {
                particles.material.uniforms.time.value = time;
            }

            // Rotate particles system
            if (particles) {
                particles.rotation.y += 0.002;
                particles.rotation.x += 0.001;
            }

            // Animate geometric shapes
            scene.children.forEach(child => {
                if (child.userData && child.userData.rotationSpeed) {
                    child.rotation.x += child.userData.rotationSpeed.x;
                    child.rotation.y += child.userData.rotationSpeed.y;
                    child.rotation.z += child.userData.rotationSpeed.z;
                    
                    // Add floating motion
                    child.position.y += Math.sin(time + child.position.x * 0.01) * 0.02;
                }
            });

            // Camera movement based on mouse position (if mouse tracking is enabled)
            camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.02;
            camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        // Mouse tracking for parallax effect
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - window.innerWidth / 2) / 100;
            mouseY = (event.clientY - window.innerHeight / 2) / 100;
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Initialize 3D background when page loads
        window.addEventListener('load', () => {
            init3DBackground();
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(0, 0, 0, 0.98)';
                header.style.backdropFilter = 'blur(30px)';
            } else {
                header.style.background = 'rgba(0, 0, 0, 0.95)';
                header.style.backdropFilter = 'blur(20px)';
            }
        });

        // Translation functionality
        function translateText() {
            const textInput = document.getElementById('textInput');
            const videoContainer = document.getElementById('videoContainer');
            const text = textInput.value.trim();
            
            if (!text) {
                alert('Please enter some text to translate');
                return;
            }

            // Show loading state
            videoContainer.innerHTML = `
                <div class="video-placeholder">
                    <div class="icon">⏳</div>
                    <p>Processing your translation...</p>
                </div>
            `;

            // Simulate translation process
            setTimeout(() => {
                videoContainer.innerHTML = `
                    <div class="video-placeholder">
                        <div class="icon">🎬</div>
                        <p>Sign language video ready!</p>
                        <small style="color: #888; display: block; margin-top: 10px;">Text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"</small>
                    </div>
                `;
            }, 2000);
        }

        function playVideo() {
            console.log('Playing video...');
            // Video play functionality would be implemented here
        }

        function pauseVideo() {
            console.log('Pausing video...');
            // Video pause functionality would be implemented here
        }

        function downloadVideo() {
            console.log('Downloading video...');
            // Video download functionality would be implemented here
            alert('Download feature will be available soon!');
        }

        function shareVideo() {
            console.log('Sharing video...');
            // Video share functionality would be implemented here
            alert('Share feature will be available soon!');
        }

        // Add typing animation to placeholder
        const textInput = document.getElementById('textInput');
        let placeholderTexts = [
            'Type your message here...',
            'Hello, how are you?',
            'Thank you for your help',
            'Have a great day!',
            'Nice to meet you'
        ];
        let currentIndex = 0;

        setInterval(() => {
            if (textInput === document.activeElement) return;
            textInput.placeholder = placeholderTexts[currentIndex];
            currentIndex = (currentIndex + 1) % placeholderTexts.length;
        }, 3000);