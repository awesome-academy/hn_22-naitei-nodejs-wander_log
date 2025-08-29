import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
// Bạn có thể thêm các icon mạng xã hội nếu muốn, ví dụ từ 'lucide-react'
// import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brandInfo}>
            <Link to="/home" className={styles.brandLink}>
              <img src="/logo.png" alt="WanderLog Logo" className={styles.logo} />
            </Link>
          </div>

          <div className={styles.navLinks}>
            <Link to="/about" className={styles.navItem}>Về chúng tôi</Link>
            <Link to="/contact" className={styles.navItem}>Liên hệ</Link>
            <Link to="/terms" className={styles.navItem}>Điều khoản</Link>
            <Link to="/privacy" className={styles.navItem}>Chính sách bảo mật</Link>
          </div>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} WanderLog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
