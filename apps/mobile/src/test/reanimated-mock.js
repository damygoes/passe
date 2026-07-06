// Minimal JS-only mock for react-native-reanimated. The library's own `/mock` export still
// transitively imports the real `index.ts` (for its jestUtils re-exports), which initializes
// the native worklets binding and crashes under Jest's Node environment — so this hand-rolled
// mock covers just the APIs actually used across apps/mobile (Animated.View/Text, shared
// values, animated styles, timing/repeat helpers, and layout animation presets used as
// `entering`/`exiting` prop values).
const RN = require('react-native')

function identity(value) {
  return value
}

const chainable = () => {
  const builder = {
    duration: () => builder,
    delay: () => builder,
    springify: () => builder,
    damping: () => builder,
    stiffness: () => builder,
    mass: () => builder,
    easing: () => builder,
    reduceMotion: () => builder,
  }
  return builder
}

module.exports = {
  __esModule: true,
  default: {
    View: RN.View,
    Text: RN.Text,
    ScrollView: RN.ScrollView,
    Image: RN.Image,
    FlatList: RN.FlatList,
    createAnimatedComponent: (Component) => Component,
  },
  createAnimatedComponent: (Component) => Component,
  useSharedValue: (initial) => ({ value: initial }),
  useAnimatedStyle: (factory) => (typeof factory === 'function' ? factory() : {}),
  useAnimatedRef: () => ({ current: null }),
  useAnimatedScrollHandler: () => undefined,
  useDerivedValue: (factory) => ({ value: typeof factory === 'function' ? factory() : undefined }),
  withTiming: (value, _config, callback) => {
    callback?.(true)
    return value
  },
  withSpring: (value, _config, callback) => {
    callback?.(true)
    return value
  },
  withDelay: (_delay, value) => value,
  withRepeat: (value) => value,
  withSequence: (...values) => values[values.length - 1],
  cancelAnimation: () => {},
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn,
  Easing: {
    linear: identity,
    ease: identity,
    quad: identity,
    cubic: identity,
    bezier: () => identity,
    inOut: (fn) => fn,
  },
  ReduceMotion: {
    System: 'system',
    Always: 'always',
    Never: 'never',
  },
  FadeIn: chainable(),
  FadeInDown: chainable(),
  FadeInUp: chainable(),
  FadeOut: chainable(),
  FadeOutDown: chainable(),
  FadeOutUp: chainable(),
  SlideInDown: chainable(),
  SlideOutDown: chainable(),
  LinearTransition: chainable(),
}
