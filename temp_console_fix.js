// SOLUCIÓN TEMPORAL PARA CONSOLA - Vercel Deploy Fix
// Ejecuta esto en la consola del navegador en https://assessment-platform-deploy.vercel.app
// mientras se actualiza la configuración CORS

console.log("🔧 APLICANDO FIX TEMPORAL PARA VERCEL DEPLOY...");

// Sobrescribir startAssessment con versión que evita problemas de CORS
window.originalStartAssessment = window.startAssessment;

window.startAssessment = async function() {
    console.log("🚀 USANDO SOLUCIÓN TEMPORAL...");
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;

    if (!name || !email || !age || !gender) {
        showMessage('Por favor, completa todos los campos.');
        return;
    }

    if (age < 16 || age > 100) {
        showMessage('La edad debe estar entre 16 y 100 años.');
        return;
    }

    try {
        console.log('🔄 Usando versión temporal sin requests cross-origin...');
        
        // Simular usuario exitoso (temporal)
        window.currentUser = {
            id: 1,
            name: name,
            email: email,
            age: parseInt(age),
            gender: gender
        };
        
        // Usar preguntas integradas directamente
        if (typeof TEMP_QUESTIONS !== 'undefined' && TEMP_QUESTIONS.length > 0) {
            window.questions = TEMP_QUESTIONS;
            console.log(`✅ ${questions.length} preguntas cargadas localmente`);
        } else {
            // Fallback con preguntas hardcodeadas
            window.questions = [
                {
                    id: 1,
                    text: "Cuando alguien me critica de manera injusta...",
                    options: [
                        "Defiendo mi punto de vista de manera calmada y respetuosa",
                        "Me quedo callado para evitar conflictos",
                        "Me pongo a la defensiva y contraataco",
                        "Acepto la crítica aunque no esté de acuerdo"
                    ]
                },
                {
                    id: 2,
                    text: "Si un compañero de trabajo me interrumpe constantemente en las reuniones...",
                    options: [
                        "Le pido respetuosamente que me permita terminar de hablar",
                        "Dejo que hable y no digo nada",
                        "Le digo bruscamente que pare de interrumpir",
                        "Evito participar en futuras reuniones"
                    ]
                },
                {
                    id: 3,
                    text: "Cuando necesito pedir un favor importante a alguien...",
                    options: [
                        "Explico claramente lo que necesito y por qué es importante",
                        "Doy muchas vueltas antes de pedirlo por miedo al rechazo",
                        "Exijo que me ayuden porque es su obligación",
                        "Prefiero no pedirlo para no molestar"
                    ]
                },
                {
                    id: 4,
                    text: "Si alguien no respeta mis límites personales...",
                    options: [
                        "Comunico mis límites de manera clara y firme",
                        "No digo nada para mantener la paz",
                        "Me enfado y reacciono de manera agresiva",
                        "Me alejo sin explicar por qué"
                    ]
                },
                {
                    id: 5,
                    text: "Cuando debo expresar una opinión diferente en un grupo...",
                    options: [
                        "Expreso mi punto de vista de manera respetuosa y fundamentada",
                        "Acepto sin cuestionar para evitar problemas",
                        "Me molesto pero no digo nada",
                        "Busco aliados antes de expresar mi opinión"
                    ]
                }
            ];
            console.log("✅ Usando preguntas de fallback");
        }

        // Cambiar a vista de evaluación
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('assessmentContainer').classList.add('active');
        
        // Inicializar evaluación
        window.currentQuestionIndex = 0;
        window.answers = {};
        
        // Mostrar primera pregunta
        showQuestion();
        updateProgress();
        
        showMessage('¡Evaluación iniciada exitosamente! (Modo temporal)', 'success');
        console.log('🎯 Evaluación iniciada en modo temporal');
        
    } catch (error) {
        console.error('Error starting assessment:', error);
        showMessage('Error al iniciar la evaluación. Por favor, inténtalo de nuevo.');
    }
};

// Sobrescribir completeAssessment para que funcione localmente
window.originalCompleteAssessment = window.completeAssessment;

window.completeAssessment = async function() {
    console.log("🏁 COMPLETANDO EVALUACIÓN EN MODO TEMPORAL...");
    
    try {
        // Mostrar pantalla de carga
        document.getElementById('assessmentContainer').style.display = 'none';
        document.getElementById('loadingScreen').style.display = 'block';
        
        // Simular procesamiento
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Calcular resultado localmente
        let score = 0;
        const totalQuestions = Object.keys(answers).length;
        
        Object.values(answers).forEach(answer => {
            if (answer === 0) score += 4; // Respuesta asertiva
            else if (answer === 1) score += 1; // Pasiva
            else if (answer === 2) score += 2; // Agresiva
            else score += 3; // Mixta
        });
        
        const percentage = Math.round((score / (totalQuestions * 4)) * 100);
        
        let level, interpretation;
        if (percentage >= 80) {
            level = "Muy Asertivo";
            interpretation = "¡Excelente! Tienes un nivel muy alto de asertividad. Sabes comunicarte de manera clara y directa, respetando tanto tus derechos como los de los demás.";
        } else if (percentage >= 60) {
            level = "Asertivo";
            interpretation = "¡Muy bien! Tienes un buen nivel de asertividad. En la mayoría de situaciones sabes expresar tus opiniones y necesidades de manera apropiada.";
        } else if (percentage >= 40) {
            level = "Moderadamente Asertivo";
            interpretation = "Tienes un nivel moderado de asertividad. En algunas situaciones te expresas bien, pero en otras podrías ser más directo o más diplomático.";
        } else {
            level = "Poco Asertivo";
            interpretation = "Tu nivel de asertividad es bajo. Te recomendamos trabajar en desarrollar habilidades de comunicación asertiva para mejorar tus relaciones.";
        }
        
        // Mostrar resultados
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('resultsContainer').style.display = 'block';
        
        document.getElementById('scoreDisplay').textContent = percentage + '%';
        document.getElementById('levelDisplay').textContent = level;
        document.getElementById('interpretationDisplay').textContent = interpretation;
        
        console.log(`🎉 Evaluación completada: ${percentage}% - ${level}`);
        
    } catch (error) {
        console.error('Error completing assessment:', error);
        document.getElementById('loadingScreen').style.display = 'none';
        showMessage('Error al procesar la evaluación.');
    }
};

console.log("✅ FIX TEMPORAL APLICADO");
console.log("🎯 Ahora puedes usar la evaluación normalmente");
console.log("💡 Este fix funciona hasta que se actualice la configuración CORS del backend");
