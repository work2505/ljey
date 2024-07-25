import { useContext } from 'react';
import { Coefficient } from '../../components/coefficient';
import { Pilot } from '../../components/pilot';
import './style.css';
import { LuckyJetContext } from '../main';
import { Loader } from '../../components/loaders/loader';

export function LuckyJetScreen() {

  const ctx = useContext(LuckyJetContext);

  return (
    <div ref={ctx.refLuckyJet} className="lucky-jet">
      <Loader />
      <Pilot />
      <Coefficient />
      <svg className="lucky-jet__svg">
        <defs>
          <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#9d7aff" stopOpacity=".33"></stop>
            <stop offset=".987" stopColor="#9d7aff" stopOpacity="0"></stop>
          </linearGradient>
          <linearGradient id="grad_stroke" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#9D7AFF"></stop>
            <stop offset=".787" stopColor="#622BFC"></stop>
            <stop offset="1" stopColor="#5c24fc" stopOpacity="0"></stop>
          </linearGradient>
        </defs>
        <g>
          <path className="lucky-jet__svg-stroke" fill="transparent" stroke="url(#grad_stroke)"></path>
          <path className="lucky-jet__svg-grad" fill="url(#grad)"></path>
        </g>
      </svg>
    </div>
  )
}
