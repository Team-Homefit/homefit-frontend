<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="brand">
            <i class="bi bi-building"></i>
            <span>HOMEFIT</span>
          </div>
          <p class="description">
            HOMEFIT은 투명하고 정확한 아파트 거래 정보를 제공합니다. 
            실시간 시세 정보와 거래 동향을 확인하세요.
          </p>
          <div class="social-links">
            <a href="#" class="social-link">
              <i class="bi bi-facebook"></i>
            </a>
            <a href="#" class="social-link">
              <i class="bi bi-instagram"></i>
            </a>
            <a href="#" class="social-link">
              <i class="bi bi-twitter"></i>
            </a>
          </div>
        </div>
        
        <div class="footer-links">
          <div class="links-group">
            <h5>서비스</h5>
            <ul>
              <li><a href="#">아파트 거래 정보</a></li>
              <li><a href="#">커뮤니티</a></li>
              <li><a href="#">챗봇</a></li>
            </ul>
          </div>
          
          <div class="links-group">
            <h5>고객지원</h5>
            <ul>
              <li><a href="#">자주 묻는 질문</a></li>
              <li><a href="#">고객센터</a></li>
              <li><a href="#">이용약관</a></li>
              <li><a href="#">개인정보처리방침</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>© {{ currentYear }} HOMEFIT. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import 'bootstrap-icons/font/bootstrap-icons.css';

// 현재 연도 계산
const currentYear = computed(() => {
  return new Date().getFullYear();
});
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 15px;
}

.footer {
  background-color: var(--light);
  border-top: 1px solid var(--light-gray);
  padding: 3rem 0 1.5rem;
  margin-top: auto; /* 이 부분이 중요합니다 */
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
  }
}

.footer-brand {
  margin-bottom: 1.5rem;
}

.brand {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.brand i {
  color: var(--primary);
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.brand span {
  color: var(--dark);
  font-weight: 700;
  font-size: 1.25rem;
}

.description {
  color: var(--gray);
  margin-bottom: 1.5rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: var(--gray);
  font-size: 1.25rem;
  transition: color 0.2s;
}

.social-link:hover {
  color: var(--primary);
}

.footer-links {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 576px) {
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }
}

.links-group h5 {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--gray);
  margin-bottom: 1rem;
  letter-spacing: 0.05em;
}

.links-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.links-group ul li {
  margin-bottom: 0.75rem;
}

.links-group ul li a {
  color: var(--gray);
  text-decoration: none;
  transition: color 0.2s;
}

.links-group ul li a:hover {
  color: var(--primary);
}

.footer-bottom {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--light-gray);
  text-align: center;
}

.footer-bottom p {
  color: var(--gray);
  margin: 0;
}
</style>