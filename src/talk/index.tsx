import React, { useEffect } from 'react';
import './Talk.css';

export const TalkComments = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'http://localhost:3000/static/embed.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      Coral.Talk.render(document.getElementById('coral_talk_stream'), {
        talk: 'http://localhost:3000/',
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div className="commentsContainer" id="coral_talk_stream" />;
};
