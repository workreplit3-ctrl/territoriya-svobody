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

const NAV_LINKS = ['Главная', 'О нас', 'Услуги', 'Портфолио', 'Контакты'];

const SERVICES = [
  {
    icon: TreePine,
    title: 'ЛАНДШАФТНОЕ ПРОЕКТИРОВАНИЕ',
    desc: 'Разработка концептуальных и рабочих проектов для частных садов, парков и общественных пространств. Каждый проект — уникальное решение, учитывающее особенности рельефа, климата и образа жизни заказчика.',
  },
  {
    icon: Flower2,
    title: 'ПОДБОР РАСТЕНИЙ',
    desc: 'Профессиональная фитодизайн-подборка растений с учётом климатической зоны, состава почвы и освещённости. Создаём многоярусные растительные композиции, меняющиеся в течение всех сезонов.',
  },
  {
    icon: Droplets,
    title: 'ИНЖЕНЕРНЫЕ СИСТЕМЫ',
    desc: 'Проектирование систем автоматического полива, дренажа, искусственного освещения. Интегрированные инженерные решения, которые остаются незаметными, но обеспечивают комфорт и долговечность сада.',
  },
  {
    icon: Ruler,
    title: 'РЕАЛИЗАЦИЯ ПРОЕКТА',
    desc: 'Авторский надзор за строительными работами, подбор подрядчиков, контроль качества материалов. Ведём проект от первого эскиза до финальной высадки растений и первого освещения.',
  },
  {
    icon: Palette,
    title: 'ДЕКОРАТИВНОЕ ОФОРМЛЕНИЕ',
    desc: 'Подбор садовой мебели, декоративных элементов, скульптур и освещения. Формируем завершённую атмосферу, в которой архитектура сада и интерьер дома становятся единым целым.',
  },
  {
    icon: Sun,
    title: 'СЕЗОННЫЙ УХОД',
    desc: 'Комплексное обслуживание сада в течение года: обрезка, подкормка, защита от вредителей, подготовка к зиме. Ваш сад будет выглядеть безупречно в любое время года.',
  },
];

const PORTFOLIO = [
  { title: 'Сад у озера', category: 'Частный сад', img: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/81138df5e3bf.jpg' },
  { title: 'Городской парк', category: 'Общественное пространство', img: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0a5124839bbc.jpg' },
  { title: 'Зен-сад', category: 'Частный сад', img: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/58e246c64af3.jpg' },
  { title: 'Терраса с видом', category: 'Частный сад', img: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e738fe3ea5dd.jpg' },
  { title: 'Парадный вход', category: 'Общественное пространство', img: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6c5c25c00fac.jpg' },
  { title: 'Вечерний сад', category: 'Частный сад', img: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/eda517f3cf4a.jpg' },
];

const STATS = [
  { value: 120, suffix: '+', label: 'Реализованных проектов' },
  { value: 15, suffix: '', label: 'Лет опыта' },
  { value: 8, suffix: '', label: 'Наград за дизайн' },
  { value: 100, suffix: '%', label: 'Экологичных решений' },
];

const HERO_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/52977949b810.jpg';

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
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between h-20">
        <a href="#" className="flex items-center gap-2 text-warm-white">
          <Leaf className="w-6 h-6 text-terracotta" strokeWidth={1.5} />
          <span className="text-lg font-semibold tracking-[0.15em] uppercase">
            Flora
          </span>
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
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${HERO_IMG})`,
            y: bgY,
          }}
        />
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-charcoal to-transparent" />
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col justify-end h-full max-w-[1400px] mx-auto px-5 sm:px-6 md:px-10 pb-28 md:pb-32 [padding-bottom:env(safe-area-inset-bottom,7rem)]"
        style={{ opacity: heroOpacity, y: textY }}
      >
        <motion.p
          className="text-terracotta-light text-sm md:text-base tracking-[0.2em] uppercase mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Студия ландшафтного дизайна
        </motion.p>

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
              <ParallaxImg
                src="https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b98d77bb3426.jpg"
                alt="Ландшафтный проект"
                className="w-full h-full"
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
                Мы — команда ландшафтных архитекторов, садовников и инженеров, объединённых
                убеждением, что окружающая среда напрямую влияет на качество жизни. Каждый
                проект, который мы создаём, начинается с глубокого понимания места: его
                истории, климата, почвы и тех, кто будет в нём жить.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className="text-warm-gray text-base md:text-lg leading-relaxed mb-8">
                Наш подход сочетает экологическую ответственность с эстетическим совершенством.
                Мы не навязываем природе форму — мы находим язык диалога между человеком и
                ландшафтом, чтобы сад стал продолжением дома и отражением характера его владельца.
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="flex items-center gap-4 text-sm text-forest font-medium tracking-wide uppercase">
                <div className="w-12 h-[1px] bg-terracotta" />
                С 2010 года
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
            Что мы делаем
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Полный цикл создания<br className="hidden md:block" /> ландшафта
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
            Проекты, в которые
            <br className="hidden md:block" /> мы вложили душу
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
              <div className={`relative ${i === 0 ? 'aspect-[16/10] sm:aspect-auto sm:h-full' : 'aspect-[4/3]'}`}>
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  STATS                                                              */
/* ------------------------------------------------------------------ */

function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-forest py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 border border-warm-white rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 border border-warm-white rounded-full" />
      </div>

      <div ref={ref} className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16">
          {STATS.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 0.15}>
              <div className="text-center">
                <motion.span
                  className="block text-5xl md:text-7xl lg:text-8xl font-bold text-warm-white"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: i * 0.15 }}
                >
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </motion.span>
                <p className="text-warm-white/60 text-sm mt-3 tracking-wide">
                  {stat.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
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
/*  CONTACTS                                                           */
/* ------------------------------------------------------------------ */

function Contacts() {
  return (
    <section id="контакты" className="bg-cream py-24 md:py-36">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <FadeIn>
            <p className="text-terracotta text-sm tracking-[0.2em] uppercase mb-4">
              Свяжитесь с нами
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8">
              Давайте создадим
              <br />
              что-то прекрасное
            </h2>
            <p className="text-warm-gray text-base md:text-lg leading-relaxed mb-10">
              Мы всегда рады обсудить ваш будущий проект. Оставьте заявку или
              свяжитесь с нами любым удобным способом — первое знакомство и консультация
              бесплатно.
            </p>

            <div className="space-y-6">
              <a href="tel:" className="flex items-center gap-4 group">
                <div className="w-12 h-12 flex items-center justify-center border border-border group-hover:border-terracotta group-hover:bg-terracotta/5 transition-all duration-300">
                  <Phone className="w-5 h-5 text-terracotta" strokeWidth={1.2} />
                </div>
                <div>
                  <p className="text-xs text-warm-gray tracking-wide uppercase">Телефон</p>
                  <p className="text-foreground font-medium">Ваш номер</p>
                </div>
              </a>

              <a href="mailto:" className="flex items-center gap-4 group">
                <div className="w-12 h-12 flex items-center justify-center border border-border group-hover:border-terracotta group-hover:bg-terracotta/5 transition-all duration-300">
                  <Mail className="w-5 h-5 text-terracotta" strokeWidth={1.2} />
                </div>
                <div>
                  <p className="text-xs text-warm-gray tracking-wide uppercase">Email</p>
                  <p className="text-foreground font-medium">Ваш email</p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center border border-border">
                  <MapPin className="w-5 h-5 text-terracotta" strokeWidth={1.2} />
                </div>
                <div>
                  <p className="text-xs text-warm-gray tracking-wide uppercase">Адрес</p>
                  <p className="text-foreground font-medium">Ваш адрес</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <form className="bg-warm-white p-8 md:p-10 border border-border/60" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-warm-gray mb-2">
                    Имя
                  </label>
                  <input
                    type="text"
                    placeholder="Как к вам обращаться"
                    className="w-full bg-transparent border-b-2 border-charcoal/20 focus:border-terracotta outline-none py-3 text-foreground placeholder:text-warm-gray/40 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-warm-gray mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    className="w-full bg-transparent border-b-2 border-charcoal/20 focus:border-terracotta outline-none py-3 text-foreground placeholder:text-warm-gray/40 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-warm-gray mb-2">
                    Сообщение
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Расскажите о вашем проекте"
                    className="w-full bg-transparent border-b-2 border-charcoal/20 focus:border-terracotta outline-none py-3 text-foreground placeholder:text-warm-gray/40 transition-colors duration-300 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-charcoal hover:bg-charcoal-light text-warm-white py-4 text-sm tracking-[0.12em] uppercase transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Отправить заявку
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </div>
            </form>
          </FadeIn>
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
          <div className="flex items-center gap-2 text-warm-white">
            <Leaf className="w-5 h-5 text-terracotta" strokeWidth={1.5} />
            <span className="text-base font-semibold tracking-[0.15em] uppercase">
              Flora
            </span>
          </div>
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
            &copy; {new Date().getFullYear()} Flora. Все права защищены.
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
        <Portfolio />
        <Stats />
        <CtaBand />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
}
