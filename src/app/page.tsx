'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import {
  Menu,
  X,
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  Leaf,
  TreePine,
  Flower2,
  Droplets,
  Sun,
  Palette,
  Ruler,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const NAV_LINKS = ['Главная', 'О нас', 'Услуги', 'Тарифы', 'Портфолио', 'Контакты'];

const SERVICES = [
  {
    icon: TreePine,
    title: 'ЛАНДШАФТНОЕ ПРОЕКТИРОВАНИЕ',
    desc: 'Разработка концептуальных и рабочих проектов для частных садов, парков и общественных пространств. Каждый проект — уникальное решение, учитывающее особенности рельефа, климата и функциональность пространства.',
  },
  {
    icon: Flower2,
    title: 'ПОДБОР РАСТЕНИЙ',
    desc: 'Профессиональная подборка растений с учётом климатической зоны, состава почвы и освещённости. Создание растительных композиций с учетом их сезонного цветения. Максимальное сохранение существующих ценных деревьев на выбранной территории.',
  },
  {
    icon: Droplets,
    title: 'ИНЖЕНЕРНЫЕ СИСТЕМЫ',
    desc: 'Проектирование систем автоматического полива, дренажа, искусственного освещения. Интегрированные инженерные решения, которые остаются незаметными, но обеспечивают комфорт и долговечность сада на долгое время.',
  },
  {
    icon: Ruler,
    title: 'РЕАЛИЗАЦИЯ ПРОЕКТА',
    desc: 'Выполняем авторский надзор за строительными работами, контроль качества материалов. Ведём проект от первого эскиза до финальной высадки растений и первого освещения.',
  },
  {
    icon: Palette,
    title: 'ДЕКОРАТИВНОЕ ОФОРМЛЕНИЕ',
    desc: 'Подбор садовой мебели, декоративных элементов, скульптур и освещения. Формируем уютную атмосферу, в которой архитектура сада и интерьер дома становятся единым целым.'
  },
  {
    icon: Sun,
    title: 'СЕЗОННЫЙ УХОД',
    desc: 'Комплексное обслуживание сада в течение года: обрезка, подкормка, защита от вредителей, подготовка к зиме. Ваш сад будет выглядеть безупречно в любое время года.',
  },
];

const KENBURNS_CLASSES = [
  'animate-kenburns-slow',
  'animate-kenburns-right',
  'animate-kenburns-left',
  'animate-kenburns-in',
  'animate-kenburns-out',
  'animate-kenburns-slow',
];

const PORTFOLIO = [
  { title: 'Сад у озера', category: 'Частный сад', img: '/portfolio-sad-ozero.jpg' },
  { title: 'Городской парк', category: 'Общественное пространство', img: '/portfolio-gorodskoy-park.jpg' },
  { title: 'Зен-сад', category: 'Частный сад', img: '/portfolio-zen-sad.jpg' },
  { title: 'Терраса с видом', category: 'Частный сад', img: '/portfolio-terrasa-s-vidom.jpg' },
  { title: 'Парадный вход', category: 'Общественное пространство', img: '/portfolio-paradnyy-vhod.png' },
  { title: 'Вечерний сад', category: 'Частный сад', img: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/eda517f3cf4a.jpg' },
];

const HERO_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/52977949b810.jpg';

/* ------------------------------------------------------------------ */
/*  PARTICLE GENERATOR HELPERS                                         */
/* ------------------------------------------------------------------ */

const EMBERS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${15 + Math.random() * 35}%`,
  bottom: `${20 + Math.random() * 30}%`,
  size: 2 + Math.random() * 3,
  dur: 3 + Math.random() * 4,
  delay: Math.random() * 5,
  drift: -30 + Math.random() * 60,
  color: Math.random() > 0.4
    ? `rgba(255, ${140 + Math.floor(Math.random() * 80)}, ${40 + Math.floor(Math.random() * 40)}, 0.9)`
    : `rgba(255, ${200 + Math.floor(Math.random() * 55)}, ${80 + Math.floor(Math.random() * 60)}, 0.7)`,
}));

const FIREFLIES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${5 + Math.random() * 90}%`,
  top: `${10 + Math.random() * 80}%`,
  size: 3 + Math.random() * 4,
  dur: 3 + Math.random() * 5,
  driftDur: 10 + Math.random() * 10,
  delay: Math.random() * 6,
  fx: -40 + Math.random() * 80,
  fy: -30 + Math.random() * 60,
  fx2: -30 + Math.random() * 60,
  fy2: -20 + Math.random() * 40,
  fx3: -35 + Math.random() * 70,
  fy3: -25 + Math.random() * 50,
}));

const LEAVES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: 14 + Math.random() * 14,
  dur: 6 + Math.random() * 7,
  delay: Math.random() * 8,
  sway: 25 + Math.random() * 50,
  swayEnd: -25 + Math.random() * 50,
  rotation: Math.random() > 0.5,
}));

const POLLEN = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: 2 + Math.random() * 3,
  dur: 5 + Math.random() * 6,
  delay: Math.random() * 8,
  dx: -30 + Math.random() * 60,
  dy: -50 + Math.random() * 30,
  dx2: -25 + Math.random() * 50,
  dy2: -70 + Math.random() * 40,
}));

/* ------------------------------------------------------------------ */
/*  PARTICLE COMPONENTS                                                */
/* ------------------------------------------------------------------ */

function Embers() {
  return (
    <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
      {/* Warm glow pulse */}
      <div
        className="absolute bottom-[25%] left-[25%] w-40 h-40 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,150,50,0.25) 0%, transparent 70%)',
          animation: 'fire-glow 3s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-[30%] left-[30%] w-28 h-28 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,180,80,0.2) 0%, transparent 70%)',
          animation: 'fire-glow 4s ease-in-out 1s infinite',
        }}
      />
      {/* Rising embers */}
      {EMBERS.map((e) => (
        <div
          key={e.id}
          className="particle-ember"
          style={{
            left: e.left,
            bottom: e.bottom,
            width: e.size,
            height: e.size,
            background: e.color,
            boxShadow: `0 0 ${e.size * 2}px ${e.color}`,
            '--drift': `${e.drift}px`,
            '--dur': `${e.dur}s`,
            '--delay': `${e.delay}s`,
          } as React.CSSProperties}
        />
      ))}
      {/* Soft glow dots */}
      {EMBERS.slice(0, 6).map((e) => (
        <div
          key={`g-${e.id}`}
          className="particle-ember-glow"
          style={{
            left: `${parseFloat(e.left) + (Math.random() - 0.5) * 10}%`,
            bottom: `${parseFloat(e.bottom) + 5}%`,
            width: e.size * 2.5,
            height: e.size * 2.5,
            background: 'rgba(255,160,60,0.15)',
            '--dur': `${e.dur * 0.7}s`,
            '--delay': `${e.delay + 0.5}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function Fireflies() {
  return (
    <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
      {FIREFLIES.map((f) => (
        <div
          key={f.id}
          className="particle-firefly"
          style={{
            left: f.left,
            top: f.top,
            width: f.size,
            height: f.size,
            background: 'radial-gradient(circle, rgba(255,240,180,0.9) 0%, rgba(255,220,120,0) 70%)',
            boxShadow: '0 0 6px 2px rgba(255,230,140,0.4)',
            '--dur': `${f.dur}s`,
            '--drift-dur': `${f.driftDur}s`,
            '--delay': `${f.delay}s`,
            '--fx': `${f.fx}px`, '--fy': `${f.fy}px`,
            '--fx2': `${f.fx2}px`, '--fy2': `${f.fy2}px`,
            '--fx3': `${f.fx3}px`, '--fy3': `${f.fy3}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function FallingLeaves() {
  return (
    <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
      {LEAVES.map((l) => (
        <div
          key={l.id}
          className="particle-leaf"
          style={{
            left: l.left,
            top: '-5%',
            width: l.size,
            height: l.size * 0.6,
            background: l.rotation
              ? 'linear-gradient(135deg, rgba(100,160,60,0.7) 0%, rgba(70,130,40,0.4) 100%)'
              : 'linear-gradient(135deg, rgba(190,150,50,0.6) 0%, rgba(170,120,30,0.3) 100%)',
            borderRadius: '0 50% 50% 50%',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
            '--sway': `${l.sway}px`,
            '--sway-end': `${l.swayEnd}px`,
            '--dur': `${l.dur}s`,
            '--delay': `${l.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function PollenDust() {
  return (
    <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
      {POLLEN.map((p) => (
        <div
          key={p.id}
          className="particle-pollen"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: 'rgba(255,255,240,0.35)',
            boxShadow: '0 0 3px rgba(255,255,200,0.2)',
            '--dx': `${p.dx}px`, '--dy': `${p.dy}px`,
            '--dx2': `${p.dx2}px`, '--dy2': `${p.dy2}px`,
            '--dur': `${p.dur}s`,
            '--delay': `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
      {/* Subtle wind streaks */}
      {[0, 1, 2].map((i) => (
        <div
          key={`w-${i}`}
          className="particle-wind"
          style={{
            left: '0',
            top: `${20 + i * 25}%`,
            width: '15vw',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
            '--dur': `${5 + i * 2}s`,
            '--delay': `${i * 3}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}


/* ------------------------------------------------------------------ */
/*  ANIMATION HELPERS                                                  */
/* ------------------------------------------------------------------ */

function FadeIn({ children, delay = 0, className = '', direction = 'up' }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const dirs: Record<string, { y: number; x: number }> = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { y: 0, x: 50 },
    right: { y: 0, x: -50 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...dirs[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

function ParallaxImg({ src, alt, className = '', speed = 0.3 }: {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.15]);

  return (
    <motion.div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ y, scale }}
        loading="lazy"
      />
    </motion.div>
  );
}

function StaggerChildren({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
    >
      {children}
    </motion.div>
  );
}

const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

/* ------------------------------------------------------------------ */
/*  ANIMATED COUNTER                                                   */
/* ------------------------------------------------------------------ */

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 2000;
    const startTime = Date.now();

    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  NAVIGATION                                                         */
/* ------------------------------------------------------------------ */

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const bgBlur = useTransform(scrollY, [0, 80], [0, 12]);
  const blurValue = useTransform(bgBlur, (v: number) => `blur(${v}px)`);

  return (
    <motion.nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backdropFilter: blurValue,
        WebkitBackdropFilter: blurValue,
      }}
    >
      <motion.div
        className="absolute inset-0 bg-charcoal/90 border-b border-white/5"
        style={{ opacity: bgOpacity }}
      />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between h-24 md:h-28">
        <a href="#" className="flex items-center">
          <div className="md:grid md:grid-cols-[auto_1fr] md:grid-rows-2 items-center gap-x-3 flex items-center">
            <img src="/logo.png" alt="Территория Свободы" className="h-12 md:h-14 w-auto object-left md:row-span-2 md:self-center" />
            <span className="hidden sm:inline text-warm-white text-2xl md:text-4xl font-semibold tracking-[0.08em] uppercase leading-none">Территория Свободы</span>
            <span className="hidden md:inline text-sm tracking-[0.08em] uppercase text-warm-white/70">Студия ландшафтного дизайна</span>
          </div>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase().replace(' ', '-')}`}
                className="text-sm tracking-[0.08em] uppercase text-warm-white/70 hover:text-warm-white transition-colors duration-300"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden text-warm-white"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-charcoal/95"
          >
            <ul className="flex flex-col px-6 py-6 gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(' ', '-')}`}
                    className="text-sm tracking-[0.08em] uppercase text-warm-white/70 hover:text-warm-white transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.05]);
  const textY = useTransform(scrollYProgress, [0, 0.2], [0, -60]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section id="главная" className="relative h-screen w-full overflow-hidden">
      <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-kenburns-slow"
          style={{
            backgroundImage: `url(${HERO_IMG})`,
            y: bgY,
          }}
        />
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-charcoal to-transparent" />
        <Embers />
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col justify-end h-full max-w-[1400px] mx-auto px-5 sm:px-6 md:px-10 pb-28 md:pb-32 [padding-bottom:env(safe-area-inset-bottom,7rem)]"
        style={{ opacity: heroOpacity, y: textY }}
      >
        <motion.h1
          className="text-warm-white text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight max-w-4xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          ИСКУССТВО
          <br />
          <span className="text-terracotta-light">СОЗДАВАТЬ</span>
          <br />
          ЛАНДШАФТ
        </motion.h1>

        <motion.div
          className="mt-8 md:mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <a
            href="#контакты"
            className="inline-flex items-center gap-3 bg-terracotta hover:bg-terracotta-light text-warm-white px-8 py-4 text-sm tracking-[0.12em] uppercase transition-all duration-300 group"
          >
            Обсудить проект
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="w-5 h-8 border-2 border-warm-white/30 rounded-full flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-2 bg-warm-white/60 rounded-full"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  ABOUT / PHILOSOPHY                                                 */
/* ------------------------------------------------------------------ */

function About() {
  return (
    <section id="о-нас" className="bg-cream py-24 md:py-36 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <FadeIn direction="left" className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src="/about-photo.jpg"
                  alt="Ландшафтный проект"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-forest/10 -z-10" />
          </FadeIn>

          <div>
            <FadeIn>
              <p className="text-terracotta text-sm tracking-[0.2em] uppercase mb-4">
                О студии
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8">
                Природа — наш
                <br />
                главный партнёр
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-warm-gray text-base md:text-lg leading-relaxed mb-6">
                Мы поможем вам превратить участок в уютное гармоничное пространство для отдыха с семьей и
                друзьями. Каждый наш проект начинается с глубокого анализа территории: его истории, климата,
                особенностей почвы и потребностей клиента.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className="text-warm-gray text-base md:text-lg leading-relaxed mb-8">
                Наш подход сочетает в себе свободу фантазии клиента и экологическую ответственность перед
                природой. Мы не навязываем природе форму, но при этом стараемся сделать пространство
                максимально удобным с функциональными зонами и без лишних затрат. Мы находим общий
                язык между человеком и ландшафтом, связываем их воедино, чтобы сад стал продолжением
                дома и отражением характера его владельца.
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="flex items-center gap-4 text-sm text-forest font-medium tracking-wide uppercase">
                <div className="w-12 h-[1px] bg-terracotta" />
                С 2025 ГОДА
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SERVICES                                                           */
/* ------------------------------------------------------------------ */

function Services() {
  return (
    <section id="услуги" className="bg-warm-white py-24 md:py-36">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <FadeIn className="mb-16 md:mb-20">
          <p className="text-terracotta text-sm tracking-[0.2em] uppercase mb-4">
            Наши услуги
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Мы предлагаем полный комплекс услуг от проектирования ландшафта до ухода
          </h2>
        </FadeIn>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {SERVICES.map((s) => (
            <motion.div
              key={s.title}
              variants={staggerItem}
              className="group relative p-8 md:p-10 border border-border/60 hover:border-terracotta/40 transition-all duration-500 hover:shadow-lg hover:shadow-terracotta/5"
            >
              <s.icon
                className="w-8 h-8 text-terracotta mb-6 transition-transform duration-300 group-hover:scale-110"
                strokeWidth={1.2}
              />
              <h3 className="text-sm font-semibold tracking-[0.1em] uppercase mb-4">
                {s.title}
              </h3>
              <p className="text-warm-gray text-sm leading-relaxed">
                {s.desc}
              </p>
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-terracotta group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PORTFOLIO                                                          */
/* ------------------------------------------------------------------ */

function Portfolio() {
  return (
    <section id="портфолио" className="bg-charcoal py-24 md:py-36 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <FadeIn className="mb-16 md:mb-20">
          <p className="text-terracotta-light text-sm tracking-[0.2em] uppercase mb-4">
            Наши работы
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-warm-white">
            Проекты, которые мы воплотим в жизнь для вас
          </h2>
        </FadeIn>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {PORTFOLIO.map((p, i) => (
            <motion.div
              key={p.title}
              variants={staggerItem}
              className={`group relative overflow-hidden cursor-pointer ${
                i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
              }`}
            >
              <div className={`relative ${i === 0 ? 'aspect-[16/10] sm:aspect-auto sm:h-full' : 'aspect-[4/3]'} overflow-hidden`}>
                <img
                  src={p.img}
                  alt={p.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/50 transition-all duration-500 flex flex-col justify-end p-6 md:p-8">
                  <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-terracotta-light text-xs tracking-[0.15em] uppercase mb-2">
                      {p.category}
                    </p>
                    <h3 className="text-warm-white text-xl md:text-2xl font-semibold">
                      {p.title}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </StaggerChildren>
      </div>
      <PollenDust />
    </section>
  );
}


/* ------------------------------------------------------------------ */
/*  CTA BAND                                                           */
/* ------------------------------------------------------------------ */

function CtaBand() {
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0.4, 0.8], ['0%', '-10%']);

  return (
    <section className="relative py-32 md:py-44 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${PORTFOLIO[1].img})`,
          }}
        />
        <div className="absolute inset-0 bg-charcoal/70" />
        <Fireflies />
      </motion.div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-warm-white leading-tight mb-8">
            Готовы преобразить<br className="hidden md:block" /> ваш участок?
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-warm-white/70 text-base md:text-lg max-w-xl mx-auto mb-10">
            Расскажите нам о вашей мечте — и мы превратим её в реальный проект,
            который будет радовать вас долгие годы.
          </p>
        </FadeIn>
        <FadeIn delay={0.4}>
          <a
            href="#контакты"
            className="inline-flex items-center gap-3 bg-terracotta hover:bg-terracotta-light text-warm-white px-10 py-5 text-sm tracking-[0.12em] uppercase transition-all duration-300 group"
          >
            Начать проект
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </FadeIn>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PRICING                                                            */
/* ------------------------------------------------------------------ */

const TARIFFS = [
  {
    name: 'Standart',
    subtitle: 'Концептуальный проект развития сада на 10–15 лет',
    area: 'Участок до 20 соток',
    price: '40 000 – 45 000 ₽',
    priceAlt: '52 000 – 58 500 ₽',
    note: 'Пакет Standart (включая доп. услуги по тарифу)',
    includes: [
      'Выезд специалиста на участок (до 100 км или онлайн)',
      'Подбор концепции: органические или геометрические формы',
      'Подбор стилистических аналогов',
      'Эскиз планировочного решения',
      'Финальный эскиз с учётом пожеланий клиента',
      '3D-визуализация основных видовых точек',
      'Финализация эскиза после 3D',
    ],
    extras: [
      { text: 'Видеопрогулка по саду', price: '5 000 – 7 000 ₽' },
      { text: 'Планиметрическая съёмка участка', price: '10 000 ₽' },
      { text: 'Дополнительные эскизы', price: '5 000 – 7 000 ₽' },
    ],
    noteHeight: 'Перепад высот более 1 м — коэфф. 1,3',
    noteTopo: 'Топосъёмка оплачивается отдельно',
  },
  {
    name: 'Standart +',
    subtitle: 'Проект в двух стилистиках: органические и геометрические',
    area: 'Участок до 20 соток',
    price: '55 000 – 65 000 ₽',
    priceAlt: null,
    note: null,
    includes: [
      'Выезд специалиста на участок (до 100 км или онлайн)',
      'Подбор стилистических аналогов',
      '2 концепции: органические + геометрические формы',
      'Эскизы планировочного решения по каждой концепции',
      'Выбор по 1 варианту для каждой стилистики',
      '3D-визуализация для каждой стилистики',
      'Финальный эскиз по выбранной стилистике',
    ],
    extras: [
      { text: 'Видеопрогулка по саду (за каждую планировку)', price: '5 000 – 7 000 ₽' },
      { text: 'Планиметрическая съёмка участка', price: '10 000 ₽' },
      { text: 'Дополнительные эскизы', price: '5 000 – 7 000 ₽' },
    ],
    noteHeight: 'Перепад высот более 1 м — коэфф. 1,3',
    noteTopo: 'Топосъёмка оплачивается отдельно',
  },
  {
    name: 'Цветники',
    subtitle: 'Укрупнённая схема цветника с ведомостью посадок',
    area: null,
    price: '10 000 – 15 000 ₽',
    priceAlt: null,
    note: 'Зависит от площади',
    includes: [
      'Разработка схемы цветника',
      'Ведомость посадок',
      'Отрисовка основных видовых точек',
    ],
    extras: [],
    noteHeight: null,
    noteTopo: null,
  },
  {
    name: 'Дендропроект',
    subtitle: 'Декоративные композиции из деревьев и кустарников',
    area: 'Весь участок',
    price: '35 000 – 50 000 ₽',
    priceAlt: null,
    note: null,
    includes: [
      'Дендрологический план всего участка',
      'Подбор деревьев и кустарников',
      'Декоративные композиции',
    ],
    extras: [],
    noteHeight: null,
    noteTopo: null,
  },
];

const ADDITIONAL_BLOCKS = [
  {
    title: 'Рабочая документация',
    desc: 'Полный комплект чертежей для реализации проекта',
    items: [
      'Генеральный план',
      'Разбивочный чертёж',
      'Проект вертикальной планировки',
      'Схема дренажной и ливневой канализации',
      'План покрытий с конструктивными решениями',
      'Схема освещения и подбор светильников',
      'Дендропроект и ведомость посадок',
      'Посадочный чертёж',
    ],
    prices: [
      { label: 'до 20 соток', value: '65 000 – 75 000 ₽' },
      { label: 'до 50 соток', value: '75 000 – 85 000 ₽' },
    ],
    note: 'Перепад высот более 1 м — коэфф. 1,3. Схема полива — дополнительно.',
  },
  {
    title: 'All Inclusive',
    desc: 'Концептуальный проект + полный комплект рабочих чертежей',
    items: [],
    prices: [
      { label: 'Standart / до 20 соток', value: '95 000 – 115 000 ₽' },
      { label: 'Standart / до 50 соток', value: '120 000 – 135 000 ₽' },
      { label: 'Standart+ / до 20 соток', value: '110 000 – 125 000 ₽' },
      { label: 'Standart+ / до 50 соток', value: '130 000 – 145 000 ₽' },
    ],
    note: 'Перепад высот более 1 м — коэфф. 1,3',
  },
  {
    title: 'Услуги для ландшафтных дизайнеров',
    desc: '3D-визуализация и вертикальная планировка по готовому эскизу',
    items: [
      { type: 'sub', text: '3D-визуализация без детализации растений', prices: ['до 20 соток — 35 000 ₽', 'до 50 соток — 45 000 ₽'] },
      { type: 'sub', text: '3D-визуализация с детализацией насаждений', prices: ['до 20 соток — 45 000 ₽*', 'до 50 соток — 55 000 ₽*'] },
      { type: 'sub', text: 'Проект вертикальной планировки по готовому эскизу', prices: ['от 15 000 ₽'] },
    ],
    prices: [],
    note: 'Перепад высот более 1 м — коэфф. 1,3. *Модели растений за счёт заказчика при отсутствии в библиотеке.',
  },
];

function Pricing() {
  return (
    <section id="тарифы" className="bg-warm-white py-24 md:py-36">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <FadeIn className="mb-16 md:mb-20">
          <p className="text-terracotta text-sm tracking-[0.2em] uppercase mb-4">
            Тарифы
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Прозрачные цены<br className="hidden md:block" /> на каждый этап
          </h2>
        </FadeIn>

        {/* ---- Main Tariff Cards ---- */}
        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {TARIFFS.map((t) => (
            <motion.div
              key={t.name}
              variants={staggerItem}
              className="bg-cream border border-border/40 p-7 md:p-8 flex flex-col hover:border-terracotta/30 transition-colors duration-500"
            >
              <p className="text-xs tracking-[0.15em] uppercase text-terracotta font-semibold mb-1">
                {t.name}
              </p>
              {t.area && (
                <p className="text-[11px] text-warm-gray mb-4">{t.area}</p>
              )}
              {!t.area && <div className="mb-4" />}
              <p className="text-warm-gray text-sm leading-relaxed mb-5 min-h-[2.5rem]">
                {t.subtitle}
              </p>

              <p className="text-2xl font-bold text-foreground mb-1">{t.price}</p>
              {t.priceAlt && (
                <p className="text-sm text-forest font-medium mb-1">{t.priceAlt}</p>
              )}
              {t.note && (
                <p className="text-xs text-warm-gray italic mb-4">{t.note}</p>
              )}
              {!t.note && !t.priceAlt && <div className="mb-4" />}

              <div className="w-full h-px bg-border/50 mb-5" />

              <ul className="space-y-2.5 flex-1 mb-5">
                {t.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-warm-gray leading-snug">
                    <Leaf className="w-3.5 h-3.5 text-forest mt-0.5 shrink-0" strokeWidth={1.5} />
                    {item}
                  </li>
                ))}
              </ul>

              {t.extras.length > 0 && (
                <>
                  <div className="w-full h-px bg-border/30 mb-4" />
                  <p className="text-[10px] tracking-[0.12em] uppercase text-warm-gray/60 mb-2">Дополнительно</p>
                  <ul className="space-y-1.5">
                    {t.extras.map((e) => (
                      <li key={e.text} className="flex justify-between text-xs text-warm-gray">
                        <span>{e.text}</span>
                        <span className="text-foreground font-medium whitespace-nowrap ml-2">{e.price}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {(t.noteHeight || t.noteTopo) && (
                <div className="mt-5 pt-4 border-t border-border/30 space-y-1">
                  {t.noteHeight && (
                    <p className="text-[11px] text-warm-gray/70">⚠ {t.noteHeight}</p>
                  )}
                  {t.noteTopo && (
                    <p className="text-[11px] text-warm-gray/70">* {t.noteTopo}</p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </StaggerChildren>

        {/* ---- Additional Blocks ---- */}
        <div className="space-y-10">
          {ADDITIONAL_BLOCKS.map((block, bi) => (
            <FadeIn key={block.title} delay={bi * 0.1}>
              <div className="bg-cream border border-border/40 p-8 md:p-10">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{block.title}</h3>
                <p className="text-warm-gray text-sm mb-6">{block.desc}</p>

                {/* Items list for Рабочая документация */}
                {block.items.length > 0 && typeof block.items[0] === 'string' && (
                  <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 mb-8">
                    {(block.items as string[]).map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-warm-gray">
                        <Ruler className="w-3.5 h-3.5 text-terracotta mt-0.5 shrink-0" strokeWidth={1.5} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Sub-items for услуги для дизайнеров */}
                {block.items.length > 0 && typeof block.items[0] === 'object' && (
                  <div className="space-y-5 mb-8">
                    {(block.items as { type: string; text: string; prices: string[] }[]).map((sub) => (
                      <div key={sub.text}>
                        <p className="text-sm font-medium text-foreground mb-1.5">{sub.text}</p>
                        <div className="flex flex-wrap gap-x-8 gap-y-1">
                          {sub.prices.map((p) => (
                            <p key={p} className="text-sm text-warm-gray">{p}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Price rows */}
                {block.prices.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    {block.prices.map((p) => (
                      <div key={p.label} className="flex items-center justify-between bg-warm-white border border-border/30 px-5 py-3.5">
                        <span className="text-sm text-warm-gray">{p.label}</span>
                        <span className="text-base font-bold text-foreground">{p.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {block.note && (
                  <p className="text-xs text-warm-gray/70 mt-2">* {block.note}</p>
                )}
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-12 text-center">
          <p className="text-warm-gray text-sm">
            Для участков площадью более 50 соток — цена договорная.
            <br />
            <a href="#контакты" className="text-terracotta hover:text-terracotta-light font-medium underline underline-offset-2 transition-colors">
              Свяжитесь с нами для расчёта
            </a>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CONTACTS                                                           */
/* ------------------------------------------------------------------ */

function Contacts() {
  return (
    <section id="контакты" className="bg-cream py-24 md:py-36">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <div>
            <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto_auto_auto] items-center gap-x-4 gap-y-6">
              <FadeIn className="row-span-4 self-start">
                <img src="/logo.png" alt="Территория Свободы" className="h-14 md:h-16 w-auto object-left" />
              </FadeIn>
              <FadeIn>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Свяжитесь с нами
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="text-warm-gray text-base md:text-lg leading-relaxed">
                  Мы готовы обсудить ваш будущий проект. Свяжитесь с нами любым удобным способом, консультация бесплатная.
                </p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <a href="tel:+79822641658" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 flex items-center justify-center border border-border group-hover:border-terracotta group-hover:bg-terracotta/5 transition-all duration-300">
                    <Phone className="w-5 h-5 text-terracotta" strokeWidth={1.2} />
                  </div>
                  <div>
                    <p className="text-xs text-warm-gray tracking-wide uppercase">Телефон</p>
                    <p className="text-foreground font-medium">+7 982 264-16-58</p>
                  </div>
                </a>
              </FadeIn>
              <FadeIn delay={0.3}>
                <a href="mailto:elena.sushnyak@mail.ru" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 flex items-center justify-center border border-border group-hover:border-terracotta group-hover:bg-terracotta/5 transition-all duration-300">
                    <Mail className="w-5 h-5 text-terracotta" strokeWidth={1.2} />
                  </div>
                  <div>
                    <p className="text-xs text-warm-gray tracking-wide uppercase">Email</p>
                    <p className="text-foreground font-medium">elena.sushnyak@mail.ru</p>
                  </div>
                </a>
              </FadeIn>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FOOTER                                                             */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="bg-charcoal py-16 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <a href="#" className="flex items-center">
            <img src="/logo.png" alt="Территория Свободы" className="h-10 md:h-12 w-auto object-left" />
          </a>
          <div className="flex flex-wrap gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(' ', '-')}`}
                className="text-sm text-warm-white/50 hover:text-warm-white transition-colors duration-300 tracking-wide"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-warm-white/30">
            &copy; {new Date().getFullYear()} Территория Свободы. Все права защищены.
          </p>
          <p className="text-xs text-warm-white/30">
            Ландшафтный дизайн и архитектура
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Services />
        <Pricing />
        <Portfolio />
        <CtaBand />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
}
