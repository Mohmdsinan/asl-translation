// Three.js scene setup
        let scene, camera, renderer, shapes = [];

        function init() {
            const container = document.getElementById('canvas-container');
            
            // Scene
            scene = new THREE.Scene();
            
            // Camera
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 15;
            
            // Renderer
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0);
            container.appendChild(renderer.domElement);
            
            // Create floating shapes
            createShapes();
            
            // Animation loop
            animate();
        }

        function createShapes() {
            const geometries = [
                new THREE.BoxGeometry(1, 1, 1),
                new THREE.SphereGeometry(0.7, 16, 16),
                new THREE.OctahedronGeometry(0.8),
                new THREE.TetrahedronGeometry(0.9),
                new THREE.IcosahedronGeometry(0.7)
            ];

            for (let i = 0; i < 25; i++) {
                const geometry = geometries[Math.floor(Math.random() * geometries.length)];
                const material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color().setHSL(Math.random(), 0.3, 0.8),
                    transparent: true,
                    opacity: 0.1 + Math.random() * 0.2,
                    wireframe: Math.random() > 0.5
                });
                
                const shape = new THREE.Mesh(geometry, material);
                
                // Random position
                shape.position.x = (Math.random() - 0.5) * 40;
                shape.position.y = (Math.random() - 0.5) * 40;
                shape.position.z = (Math.random() - 0.5) * 20;
                
                // Random rotation speed
                shape.rotationSpeed = {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                };
                
                // Random movement
                shape.movement = {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                    z: (Math.random() - 0.5) * 0.005
                };
                
                shapes.push(shape);
                scene.add(shape);
            }
            
            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(10, 10, 5);
            scene.add(directionalLight);
            
            const pointLight = new THREE.PointLight(0x8a2be2, 0.5, 50);
            pointLight.position.set(-10, -10, -10);
            scene.add(pointLight);
        }

        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate and move shapes
            shapes.forEach(shape => {
                shape.rotation.x += shape.rotationSpeed.x;
                shape.rotation.y += shape.rotationSpeed.y;
                shape.rotation.z += shape.rotationSpeed.z;
                
                shape.position.x += shape.movement.x;
                shape.position.y += shape.movement.y;
                shape.position.z += shape.movement.z;
                
                // Boundary check and respawn
                if (Math.abs(shape.position.x) > 25 || Math.abs(shape.position.y) > 25 || Math.abs(shape.position.z) > 15) {
                    shape.position.x = (Math.random() - 0.5) * 40;
                    shape.position.y = (Math.random() - 0.5) * 40;
                    shape.position.z = (Math.random() - 0.5) * 20;
                }
            });
            
            // Gentle camera movement
            camera.position.x = Math.sin(Date.now() * 0.0005) * 2;
            camera.position.y = Math.cos(Date.now() * 0.0003) * 1;
            camera.lookAt(scene.position);
            
            renderer.render(scene, camera);
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Mouse interaction
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - window.innerWidth / 2) * 0.0001;
            mouseY = (event.clientY - window.innerHeight / 2) * 0.0001;
            
            camera.rotation.y += mouseX * 0.5;
            camera.rotation.x += mouseY * 0.5;
        });

        // Initialize the scene
        init();