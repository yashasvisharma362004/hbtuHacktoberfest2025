const loadingScreen = document.getElementById('loadingScreen');
const mainContainer = document.getElementById('mainContainer');
const speedNeedle = document.getElementById('speedNeedle');
const speedValue = document.getElementById('speedValue');
const meterStatus = document.getElementById('meterStatus');
const resultsContainer = document.getElementById('resultsContainer');
const connectionBox = document.getElementById('connectionBox');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const connectionSpeed = document.getElementById('connectionSpeed');
const checkAgainBtn = document.getElementById('checkAgain');

function classifySpeed(mbps) {
    const speed = parseFloat(mbps);
    if (speed >= 20) return { class: 'Fast', label: 'Fast' };
    if (speed >= 5) return { class: 'Moderate', label: 'Moderate' };
    return { class: 'Slow', label: 'Slow' };
}

function updateSpeedMeter(speed, isFinal = false) {
    const maxSpeed = 20;
    const clampedSpeed = Math.min(speed, maxSpeed);
    const percentage = clampedSpeed / maxSpeed;
    
    const needleRotation = -90 + (percentage * 180);
    
    speedNeedle.style.transform = `translateX(-50%) rotate(${needleRotation}deg)`;
    
    if (!isFinal) {
        speedValue.textContent = speed.toFixed(1);
   
        if (Math.random() > 0.7) {
            speedValue.style.opacity = '0.6';
            setTimeout(() => { speedValue.style.opacity = '1'; }, 100);
        }

        const scanningMessages = [
            'Scanning network...',
            'Measuring speed...',
            'Analyzing connection...',
            'Calculating Mbps...',
            'Testing bandwidth...',
            'Optimizing measurement...'
        ];
        if (Math.random() > 0.9) {
            const randomMessage = scanningMessages[Math.floor(Math.random() * scanningMessages.length)];
            meterStatus.textContent = randomMessage;
        }
    } else {
        speedValue.textContent = speed.toFixed(1);
        speedValue.style.opacity = '1';
        speedValue.style.animation = 'celebrate 0.6s ease-in-out';
        setTimeout(() => {
            speedValue.style.animation = '';
        }, 600);
    }
}

async function measureSpeed() {
    try {
        const start = performance.now();
        const res = await fetch("https://speed.cloudflare.com/__down?bytes=500000", { 
            cache: "no-store" 
        });
        await res.arrayBuffer();
        const duration = (performance.now() - start) / 1000;
        const bitsLoaded = 500000 * 8;
        const speed = (bitsLoaded / duration / 1000000);
        return Math.min(speed, 25); 
    } catch (error) {
        console.error('Speed test failed:', error);
        return 0;
    }
}

async function animateMeterScanning() {
    let currentSpeed = 0;
    const finalSpeed = parseFloat(await measureSpeed());
    const maxSpeed = 20;
 
    speedNeedle.classList.add('scanning');
    
    return new Promise((resolve) => {
        const animate = () => {
            let increment;
            if (currentSpeed < finalSpeed * 0.3) {
                increment = finalSpeed / 25 + Math.random() * 0.5;
            } else if (currentSpeed < finalSpeed * 0.8) {
                increment = finalSpeed / 40 + Math.random() * 0.3;
            } else {
                increment = finalSpeed / 80 + Math.random() * 0.1;
            }
            
            currentSpeed += increment;
            
            if (currentSpeed >= finalSpeed) {
                currentSpeed = finalSpeed;
                speedNeedle.classList.remove('scanning');
                updateSpeedMeter(currentSpeed, true);
                resolve(finalSpeed);
            } else {
                updateSpeedMeter(currentSpeed);
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    });
}

function showResults(speed) {
    const { class: speedClass, label } = classifySpeed(speed);
    
    connectionBox.className = `connection-box ${speedClass}`;
    statusText.textContent = `${label} Connection`;
    connectionSpeed.textContent = `${speed.toFixed(1)} Mbps`;
    
    setTimeout(() => {
        resultsContainer.classList.remove('hidden');
        resultsContainer.style.animation = 'slideUp 0.8s ease-out';
        meterStatus.textContent = 'Speed test completed!';
        meterStatus.style.background = 'linear-gradient(135deg, #008BFF, #FF007B)';
        meterStatus.style.webkitBackgroundClip = 'text';
        meterStatus.style.backgroundClip = 'text';
        meterStatus.style.webkitTextFillColor = 'transparent';
    }, 500);
    
    setTimeout(() => {
        checkAgainBtn.classList.remove('hidden');
        checkAgainBtn.style.animation = 'slideUp 0.6s ease-out';
    }, 1200);
}

async function runSpeedTest() {
    try {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            mainContainer.classList.remove('hidden');
            
            setTimeout(async () => {
                const finalSpeed = await animateMeterScanning();
                showResults(finalSpeed);
            }, 800);
        }, 3000);
        
    } catch (error) {
        console.error('Speed test error:', error);
        meterStatus.textContent = 'Speed test failed. Please try again.';
        meterStatus.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
        meterStatus.style.webkitBackgroundClip = 'text';
        meterStatus.style.backgroundClip = 'text';
        meterStatus.style.webkitTextFillColor = 'transparent';
    }
}

checkAgainBtn.addEventListener('click', () => {
    loadingScreen.classList.remove('hidden');
    mainContainer.classList.add('hidden');
    resultsContainer.classList.add('hidden');
    checkAgainBtn.classList.add('hidden');

    updateSpeedMeter(0);
    meterStatus.textContent = 'Scanning network speed...';
    meterStatus.style.background = 'linear-gradient(135deg, #ff00b7 0%, #0004ff 100%)';
    meterStatus.style.webkitBackgroundClip = 'text';
    meterStatus.style.backgroundClip = 'text';
    meterStatus.style.webkitTextFillColor = 'transparent';

    setTimeout(runSpeedTest, 500);
});

const style = document.createElement('style');
style.textContent = `
    @keyframes celebrate {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

runSpeedTest();