"use client";
import React from "react";
import { useAppSelector } from "../lib/redux/hooks"; // Ajusta la ruta según tu estructura
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Estilos base + modo oscuro
const styles = {
  container: {
    minHeight: "calc(100vh - 120px)",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    background: "radial-gradient(circle at 10% 20%, rgba(0,123,255,0.1) 0%, rgba(255,255,255,0) 30%)",
    padding: "20px",
    transition: "all 0.3s ease",
  },
  containerDark: {
    // FONDO si quieres cambiar en dark
    background: "radial-gradient(circle at 10% 20%, rgba(50,50,50,0.3) 0%, rgba(0,0,0,0) 30%)",
  },

  logo: {
    width: "min(500px, 90%)",
    marginBottom: "40px",
    // Importante: NO ponemos "transition: filter" ni nada similar
  },
  logoDark: {
    // Halo luminoso permanente
    filter: "drop-shadow(0 0 30px rgba(255, 255, 255, 0.3))",
  },

  card: {
    position: "relative" as const,
    width: "90%",
    maxWidth: "600px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    padding: "40px 20px",
    margin: "0 auto",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    textAlign: "center" as const,
    transition: "all 0.3s ease",
  },
  cardDark: {
    background: "rgba(255, 255, 255, 0.07)",
    boxShadow: "0 8px 32px rgba(255,255,255,0.05)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },

  title: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    background: "linear-gradient(45deg, var(--color-primary), #00a8ff)",
    WebkitBackgroundClip: "text" as const,
    color: "transparent",
    margin: "16px 0",
    fontWeight: 700,
  },
  subtitle: {
    fontSize: "clamp(1rem, 3vw, 1.3rem)",
    color: "var(--color-subtext)",
    marginBottom: "40px",
    lineHeight: 1.6,
  },
  button: {
    margin: "10px",
    padding: "16px 35px",
    fontSize: "1rem",
    borderRadius: "12px",
    background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    display: "inline-flex" as const,
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 4px 15px rgba(0,123,255,0.3)",
  },
};

export default function HomePage() {
  const router = useRouter();
  // Leemos si el modo oscuro está activo
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  // Combinar estilos base + dark
  const containerStyle = {
    ...styles.container,
    ...(isDarkMode ? styles.containerDark : {}),
  };
  const logoStyle = {
    ...styles.logo,
    ...(isDarkMode ? styles.logoDark : {}),
  };
  const cardStyle = {
    ...styles.card,
    ...(isDarkMode ? styles.cardDark : {}),
  };

  // Navegación
  const navigate = (path: string) => {
    router.push(path);
  };

  return (
    <div style={containerStyle}>
      <motion.img
        src="https://iz.academy/wp-content/uploads/2025/01/Proyecto-Prometeo-scaled.jpeg"
        alt="Logo"
        style={logoStyle}
        // SOLO animamos opacidad y posición
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      <motion.div
        style={cardStyle}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1 
          style={styles.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ¡Bienvenido a IZETA!
        </motion.h1>

        <motion.p
          style={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Elige una opción para continuar
        </motion.p>

        <div>
          <motion.button
            style={styles.button}
            onClick={() => navigate("/login")}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 7px 20px rgba(0,123,255,0.4)" 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
            </svg>
            Iniciar Sesión
          </motion.button>

          <motion.button
            style={styles.button}
            onClick={() => navigate("/register")}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 7px 20px rgba(0,123,255,0.4)" 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
            </svg>
            Registrarse
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
