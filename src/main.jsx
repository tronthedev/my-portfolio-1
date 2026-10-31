import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { ArrowDown, ArrowDownRight, ArrowUpRight, Asterisk, ArrowRight, Moon, Sun, Menu, X, MoveUpRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './style.css';

gsap.registerPlugin(ScrollTrigger);

const quotes = [
  'Make it useful. Make it beautiful. Make it memorable.',
  'Good work has a point of view.',
  'The best details are the ones you can feel.',
  'Build with curiosity. Finish with intention.',
  'A better experience changes everything.'
];

const services = [
  ['1', 'Full-stack', 'Development', 'From the first screen to the systems behind it. Thoughtful products, built end to end.', ''],
  ['2', 'Frontend', 'Development', 'Expressive interfaces with responsive layouts, rich interactions and considered details.', ''],
  ['3', 'Backend', 'Development', 'Reliable foundations, clean logic and server-side systems that do their job quietly.', ''],
  ['4', 'UI / UX', 'Design', 'Clear journeys and confident visual systems that make digital products feel natural.', ''],
  ['5', 'Landing', 'Pages', 'Focused, high-impact pages that make the value obvious and the next step easy.', ''],
  ['6', 'E-commerce', '& web apps', 'Useful digital experiences for browsing, buying, managing and getting things done.', ''],
  ['7', 'Digital', 'Experiences', 'A considered mix of strategy, design and development for ideas worth bringing to life.', '']
];

function App() {
  const [dark, setDark] = useState(true);
  const [quote, setQuote] = useState(0);
const [intro, setIntro] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const introRef = useRef(null);

  useEffect(() => {
    const timer = window.setInterval(() => setQuote(q => (q + 1) % quotes.length), 4600);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!intro) return;

    // Keep the document still while the full-screen intro is playing.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => setIntro(false)
      });

      tl.fromTo('.preloader-rule',
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: .8, ease: 'power4.inOut' })
        .fromTo('.preloader-letter',
          { yPercent: 125, rotate: 7, opacity: 0 },
          { yPercent: 0, rotate: 0, opacity: 1, duration: 1, stagger: .08, ease: 'power4.out' }, '-=.12')
        .fromTo('.preloader-foot span, .preloader-top span, .preloader-center p',
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: .55, stagger: .07 }, '-=.35')
        .to('.preloader-word',
          { letterSpacing: '.12em', duration: .7, ease: 'power2.inOut' }, '-=.2')
        // Reveal the already-rendered homepage by lifting the overlay itself,
        // rather than letting the intro occupy space in the page layout.
        .to('.preloader-center, .preloader-top, .preloader-foot',
          { y: -22, opacity: 0, duration: .35, stagger: .035, ease: 'power2.in' }, '+=.35')
        .to(introRef.current, {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 1.05,
          ease: 'power4.inOut'
        }, '-=.05');
    }, introRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = previousOverflow;
    };
  }, [intro]);

  useEffect(() => {
    if (intro) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-eyebrow, .hero-copy, .hero-bottom-row', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .85, stagger: .14, ease: 'power3.out', delay: .1 });
      gsap.fromTo('.hero-title .hero-line span', { yPercent: 120, rotate: 3 }, { yPercent: 0, rotate: 0, duration: 1.1, stagger: .13, ease: 'power4.out', delay: .15 });
      gsap.fromTo('.hero-object', { scale: .45, rotate: -35, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 1.5, ease: 'elastic.out(1, .65)', delay: .4 });
      gsap.to('.hero-object', { y: -22, rotate: 7, duration: 3.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.orbit-ring', { rotate: 360, duration: 28, repeat: -1, ease: 'none' });
      gsap.to('.hero-spark', { rotate: 360, duration: 18, repeat: -1, ease: 'none' });
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(el, { y: 75, opacity: 0, rotateX: -7 }, { y: 0, opacity: 1, rotateX: 0, duration: 1.05, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });
      gsap.utils.toArray('.service-card').forEach((card) => {
        const title = card.querySelector('.service-title');
        card.addEventListener('mouseenter', () => gsap.to(title, { x: 12, duration: .35, ease: 'power3.out' }));
        card.addEventListener('mouseleave', () => gsap.to(title, { x: 0, duration: .45, ease: 'power3.out' }));
      });
      gsap.to('.marquee-track', { xPercent: -50, duration: 28, repeat: -1, ease: 'none' });
      gsap.to('.about-asterisk', { rotate: 360, duration: 22, repeat: -1, ease: 'none' });
      gsap.to('.work-shape', { y: -28, rotate: 12, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.work-shape-two', { y: 26, rotate: -14, duration: 5.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    });
    return () => ctx.revert();
  }, [intro]);

  useEffect(() => {
    if (intro) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const track = document.querySelector('.approach-track');
      const rail = document.querySelector('.approach-rail');
      if (!track || !rail) return;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth * 0.82);
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: rail,
          start: 'top top+=90',
          end: () => `+=${distance() + window.innerHeight * 0.35}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
    });
    return () => mm.revert();
  }, [intro]);


  const closeMenu = () => setMenuOpen(false);

  return (
    <main className={dark ? 'site dark' : 'site'}>
      {intro && createPortal(
        <div className="preloader" ref={introRef} role="status" aria-label="Introducing Sarthak portfolio">
          <div className="preloader-top"><span>INDEPENDENT DEVELOPER</span><span>PORTFOLIO / 2026</span></div>
          <div className="preloader-center"><div className="preloader-rule"/><h1 className="preloader-word">{'SARTHAK'.split('').map((c, i) => <span className="preloader-letter" key={i}>{c}</span>)}</h1><p>IDEAS INTO EXPERIENCES <i>✳</i></p></div>
          <div className="preloader-foot"><span>CREATIVE DEVELOPMENT</span><span>LOADING THE GOOD STUFF</span></div>
        </div>,
        document.body
      )}

      <header className="nav-shell">
        <a className="wordmark" href="#home" onClick={closeMenu}>S<span></span></a>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <a href="#about" onClick={closeMenu}>About <sup></sup></a><a href="#services" onClick={closeMenu}>Services <sup></sup></a><a href="#approach" onClick={closeMenu}>Approach <sup></sup></a><a href="#contact" onClick={closeMenu}>Contact <sup></sup></a>
        </nav>
        <div className="nav-actions">
          <button className="mode-toggle" aria-label="Toggle colour theme" onClick={() => setDark(!dark)}>{dark ? <Sun size={17}/> : <Moon size={17}/>}<span>{dark ? 'LIGHT' : 'DARK'}</span></button>
          <a className="nav-contact" href="#contact">LET’S TALK <MoveUpRight size={15}/></a>
          <button className="menu-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-topline"><span><i className="live-dot"/> OPEN FOR FREELANCE OPPORTUNITIES</span><span>INDEPENDENT DEVELOPER <b>✳</b> AVAILABLE WORLDWIDE</span></div>
        <div className="hero-layout">
          <div className="hero-content">
            <p className="hero-eyebrow"><span>FULL-STACK DEVELOPER</span><span>— BASED ONLINE, WORKING EVERYWHERE</span></p>
            <h1 className="hero-title"><span className="hero-line"><span>MAKING</span></span><span className="hero-line hero-line-indent"><span className="outline-word">DIGITAL</span></span><span className="hero-line"><span>FEEL <em>ALIVE.</em></span></span></h1>
            <div className="hero-bottom-row"><p className="hero-copy">Independent developer crafting thoughtful digital experiences — from ambitious ideas to useful things people love to use.</p><div className="hero-ctas"><a className="hero-secondary" href="#contact">HAVE A PROJECT? <ArrowUpRight size={15}/></a></div></div>
          </div>
          
        </div>
        
      </section>

      
      <section className="quote-section">
        <div className="quote-side"><span></span><span></span></div>
        <div className="quote-main" key={quote}><span className="quote-open">“</span><p>{quotes[quote]}</p><span className="quote-progress">0{quote + 1} <i>/</i> 0{quotes.length}</span></div>
        <div className="quote-controls">{quotes.map((_, i) => <button key={i} className={quote === i ? 'quote-dot active' : 'quote-dot'} onClick={() => setQuote(i)} aria-label={`Show thought ${i + 1}`}/>)}</div>
      </section>

      <section className="about section-pad" id="about">
        <div className="section-head" data-reveal><span className="section-no"></span><span className="section-note">A LITTLE CONTEXT, A LOT OF CURIOSITY</span></div>
        <div className="about-grid">
          <div className="about-title-wrap" data-reveal><span className="overline">HELLO, I’M SARTHAK <Asterisk className="about-asterisk" size={22}/></span><h2 className="display-heading">NOT HERE<br/>TO MAKE<br/><em>MORE OF</em><br/>THE SAME.</h2></div>
          <div className="about-text" data-reveal><p className="about-lead">I’m Sarthak — an independent full-stack developer focused on building reliable, scalable digital products.</p><p>I care about the thinking behind an interface as much as the interface itself. The aim is to make useful things work beautifully, keep the details considered and make every interaction feel like it belongs.</p><div className="about-signoff"><span></span><span></span></div></div>
        </div>

      </section>

      <section className="services section-pad" id="services">
        <div className="section-head" data-reveal><span className="section-no"></span><span className="section-note">A GOOD IDEA DESERVES A GOOD BUILD</span></div>
        <div className="services-intro" data-reveal><h2 className="display-heading">BUILT FOR<br/><em>WHAT’S NEXT.</em></h2><p>From the first sketch to the final interaction, I bring design thinking and development together to create digital experiences with purpose.</p></div>
        <div className="service-list">{services.map(([n, a, b, desc, count], i) => <a className={`service-card service-card-${i + 1}`} href="#contact" key={n}>
          <span className="service-number">{n} <i></i></span><h3 className="service-title"><span>{a}</span> <em>{b}</em></h3><p className="service-desc">{desc}</p><span className="service-count">{count}</span><span className="service-arrow"><ArrowUpRight size={25}/></span>
        </a>)}</div>
      </section>

      <section className="approach section-pad" id="approach">
        <div className="section-head" data-reveal><span className="section-no"></span><span className="section-note">THOUGHT THROUGH. BUILT WITH CARE.</span></div>
        <div className="approach-rail">
          <div className="approach-track">
            <article className="approach-panel approach-panel-intro">
              <span className="overline">THE PROCESS IS PART OF THE PRODUCT</span>
              <h2 className="display-heading">THINK<br/>IT.<br/><em>MAKE IT.</em></h2>
              <div className="approach-orbit"><span>✳</span></div>
              <span className="panel-footnote">A GOOD BUILD STARTS WITH A GOOD QUESTION ↗</span>
            </article>
            <article className="approach-panel approach-panel-one"><span className="panel-number">01 / DISCOVER</span><span className="panel-symbol">?</span><h3>Start<br/>with <em>why.</em></h3><p>Understand the problem, the people and what a good outcome actually looks like. Get curious before getting clever.</p><span className="panel-arrow">↗</span></article>
            <article className="approach-panel approach-panel-two"><span className="panel-number">02 / DIRECT</span><span className="panel-symbol">✳</span><h3>Find<br/>the <em>feeling.</em></h3><p>Shape a clear direction with the right balance of personality, clarity and function. Give the idea a point of view.</p><span className="panel-arrow">↗</span></article>
            <article className="approach-panel approach-panel-three"><span className="panel-number">03 / BUILD</span><span className="panel-symbol">⌘</span><h3>Make it<br/><em>real.</em></h3><p>Bring the pieces together with attention to quality, usability and performance. Make every detail earn its place.</p><span className="panel-arrow">↗</span></article>
            <article className="approach-panel approach-panel-four"><span className="panel-number">04 / REFINE</span><span className="panel-symbol">↗</span><h3>Make it<br/><em>better.</em></h3><p>Test, refine and polish until the experience feels right from end to end. Good work gets the extra pass.</p><span className="panel-arrow">↗</span></article>
          </div>
          <div className="rail-instruction"><span>THE PROCESS, IN MOTION</span><span>SCROLL / SWIPE TO MOVE <ArrowDownRight size={16}/></span></div>
        </div>
      </section>

      <section className="work-section section-pad">
        <div className="section-head" data-reveal><span className="section-no"></span><span className="section-note">ROOM FOR SOMETHING GREAT</span></div>
        <div className="work-stage" data-reveal><div className="work-stamp">A SPACE<br/>FOR WHAT’S<br/><em>NEXT.</em></div><div className="work-shape"/><div className="work-shape work-shape-two"/><div className="work-cross cross-one">✳</div><div className="work-cross cross-two">✳</div><div className="work-stage-copy"><span>NO PLACEHOLDER PROJECTS.</span><p>Just an open canvas, waiting for work worth putting out into the world.</p></div><span className="work-stage-index">CANVAS / 001</span></div>
      </section>

      <section className="contact section-pad" id="contact">
        <div className="section-head" data-reveal><span className="section-no"></span><span className="section-note">OPEN FOR FREELANCE OPPORTUNITIES</span></div>
        <div className="contact-grid"><div className="contact-left" data-reveal><span className="overline"><i className="live-dot"/> CURRENTLY OPEN TO PROJECTS</span><h2 className="display-heading">GOT A<br/>GOOD ONE?<br/><em>LET’S GO.</em></h2><p>Have an idea taking shape? Tell me what you’re thinking. We can figure out the rest together.</p><div className="contact-socials"><a href="https://www.linkedin.com/in/sarthak-hinge-90626834a/" target="_blank" rel="noreferrer">LINKEDIN <ArrowUpRight size={15}/></a><a href="https://wa.me/918806997354" target="_blank" rel="noreferrer">WHATSAPP <ArrowUpRight size={15}/></a><a href="mailto:sarthak2288hinge@gmail.com" >EMAIL <ArrowUpRight size={15}/></a></div></div>
          <form className="contact-form" data-reveal onSubmit={(e) => { e.preventDefault(); alert('The form design is ready. Email delivery will be connected once your email and serverless provider are configured.'); }}><label>YOUR NAME<input required placeholder="Name"/></label><label>EMAIL ADDRESS<input type="email" required placeholder="you@example.com"/></label><label>WHAT ARE YOU THINKING?<textarea rows="4" required placeholder="A little about your idea..."/></label><button className="submit-button" type="submit">SEND THE DETAILS <ArrowUpRight size={18}/></button><p className="form-disclaimer">Email delivery will be connected when the contact endpoint is configured.</p></form></div>
      </section>

      <footer className="footer section-pad"><div className="footer-top"><span>INDEPENDENT DEVELOPER <i>✳</i> AVAILABLE FOR FREELANCE</span><a href="#home">BACK TO THE TOP ↑</a></div><div className="footer-big">LET’S MAKE<br/><em>IT MATTER.</em></div><div className="footer-bottom"><a href="#home" className="footer-logo">S<span></span></a><span>© 2026 SARTHAK</span><a href="#contact">SAY HELLO <ArrowUpRight size={15}/></a></div></footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
