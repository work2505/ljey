import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import { Loader } from '../../components/loaders/loader';
import { Background } from '../background';
import { TLJContext, TLJProps } from './type';
import { LuckyJetScreen } from '../luckyjet';
import { LuckyJet } from '../../scripts/graph.class';

import { createContext } from 'react';
import { options } from './gsap.options';
import { PreLoader } from '../../components/loaders/pre_loader';

export const LuckyJetContext = createContext<TLJContext>({
  coefficient: 0,
  ended: false,
  refLuckyJet: undefined,
  refCoefficient: undefined
});


function Componenet(props: TLJProps) {

  const refLuckyJet = useRef<HTMLDivElement>();
  const refCoefficient = useRef<HTMLDivElement>();

  const [luckyJet, setLuckyJet] = useState<LuckyJet | null>(null);
  const [started, setStarted] = useState(false);
  const [sound, setSound] = useState(false);
  const [music, setMusic] = useState(false);

  const refFonAudio = useRef<HTMLMediaElement | null>(null);
  const refStartAudio = useRef<HTMLMediaElement | null>(null);
  const refFinishAudio = useRef<HTMLMediaElement | null>(null);

  useEffect(() => {
    if (!refLuckyJet) return;
    setLuckyJet(LuckyJet.Instance);
  }, [refLuckyJet]);

  useEffect(() => {
    if (!luckyJet) return;
    luckyJet.loaded(refLuckyJet.current!).setOptions(options);
  }, [luckyJet]);

  const handleSounds = () => {
    setSound(!sound);
    document.getElementById("sounds")?.classList.toggle("active");
  };
  const handleMusic = () => {
    setMusic(!music);
    document.getElementById("music")?.classList.toggle("active");
  };

  useEffect(() => {
    if (refFonAudio.current) {
      if (music) {
        refFonAudio.current.play().then(_ => (true));
      } else {
        if (!refFonAudio.current.paused) refFonAudio.current.pause();
      }
    }
  }, [music, sound]);

  useEffect(() => {
    if (refCoefficient) {
      if (refCoefficient?.current && props.coefficient >= 1) refCoefficient.current.innerText = (String(props.coefficient.toFixed(2)));
      if (luckyJet) {
        if (props.coefficient === 1) luckyJet._onResize();
        if (props.coefficient > 1 && !started) {
          setStarted(true);
          if (sound && refStartAudio.current) refStartAudio.current.play().then(_ => (true));
        }
        if (props.ended) {
          luckyJet.end();
          if (sound && refFinishAudio.current) refFinishAudio.current.play().then(_ => (true));
          if (started) setStarted(false);
        }
      }
    }
    if (luckyJet) luckyJet._updateSizes();
  }, [sound, refCoefficient, props.coefficient, props.ended]);

  useEffect(() => {
    if (!luckyJet) return;
    if (started) luckyJet.start();
    else luckyJet.end();
  }, [started]);


  if (props.coefficient < 1) return (<Loader />);
  return (
    <LuckyJetContext.Provider value={{ coefficient: props.coefficient, ended: props.ended, refLuckyJet, refCoefficient }}>

      <audio ref={refFonAudio} loop={true}>
        <source src="./media/fon_music.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={refStartAudio}>
        <source src="./media/start.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={refFinishAudio}>
        <source src="./media/end.mp3" type="audio/mpeg" />
      </audio>

      <div className="jet_main_animatsion__content">
        <div className="jet_main_animatsion_bg"></div>

        <Background>
          <div className="df-aic">
            <button id="sounds" className="jet-nav-setting-btn" onClick={() => handleSounds()}>♪</button>
            <button id="music" className="jet-nav-music-btn" onClick={() => handleMusic()}>♫</button>
          </div>
          <LuckyJetScreen />
        </Background>

      </div>
    </LuckyJetContext.Provider>
  )
}

export function Main() {

  const [coefficient, setCoefficient] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    window.addEventListener("load", (event) => {
      if (event) setTimeout(() => setLoaded(true), 500);
    });
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (coefficient <= 0) timer = setTimeout(() => { setCoefficient(1); }, 2500);
    else if (coefficient === 1) {
      timer = setTimeout(() => setCoefficient(0.11 + coefficient), 5000);
    } else if (coefficient > 1) {
      if (ended) setEnded(false);
      if (Math.random() > 0.95) {
        setEnded(true);
        timer = setTimeout(() => setCoefficient(1), 2500);
      } else timer = setTimeout(() => setCoefficient((0.1 + (Math.random() / 5)) + coefficient), 250);
    }
    return () => { if (timer) clearTimeout(timer); }
  }, [coefficient]);

  if (!loaded) return (<PreLoader />);
  return (
    <div className="container">
      {/* div.container родительский элемент задает размеры дочернему компоненту */}
      <Componenet
        ended={ended}
        coefficient={coefficient}
      />
    </div>
  );
}

