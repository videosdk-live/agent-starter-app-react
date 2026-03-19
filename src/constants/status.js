import { COLORS } from './colors';

export const STATUS_CONFIGS = {
  Connecting: {
    w: 105,
    h: 20,
    text: 'Connecting...',
    bg: COLORS.CONNECTING.BG,
    border: COLORS.CONNECTING.BORDER,
    color: COLORS.CONNECTING.TEXT,
  },
  Connected: {
    w: 87,
    h: 20,
    text: 'Connected',
    bg: COLORS.CONNECTED.BG,
    border: COLORS.CONNECTED.BORDER,
    color: COLORS.CONNECTED.TEXT,
  },
  Listening: {
    w: 76,
    h: 20,
    text: 'Listening',
    bg: COLORS.LISTENING.BG,
    border: COLORS.LISTENING.BORDER,
    color: COLORS.LISTENING.TEXT,
  },
  Thinking: {
    w: 73,
    h: 20,
    text: 'Thinking',
    bg: COLORS.THINKING.BG,
    border: COLORS.THINKING.BORDER,
    color: COLORS.THINKING.TEXT,
  },
  Speaking: {
    w: 77,
    h: 20,
    text: 'Speaking',
    bg: COLORS.SPEAKING.BG,
    border: COLORS.SPEAKING.BORDER,
    color: COLORS.SPEAKING.TEXT,
  },
  Disconnected: {
    w: 103,
    h: 20,
    text: 'Disconnected',
    bg: COLORS.DISCONNECTED.BG,
    border: COLORS.DISCONNECTED.BORDER,
    color: COLORS.DISCONNECTED.TEXT,
  },
  Idle: {
    w: 51,
    h: 20,
    text: 'Idle',
    bg: COLORS.IDLE.BG,
    border: COLORS.IDLE.BORDER,
    color: COLORS.IDLE.TEXT,
  }
};
