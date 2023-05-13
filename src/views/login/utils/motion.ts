// import the necessary components from Vue
import { h, defineComponent, withDirectives, resolveDirective } from "vue";

/** 封装@vueuse/motion动画库中的自定义指令v-motion */
export default defineComponent({
  name: "Motion",
  props: {
    // set the delay prop to a number with a default value of 50
    delay: {
      type: Number,
      default: 50
    }
  },
  render() {
    // destructure the delay prop
    const { delay } = this;
    // resolve the motion directive
    const motion = resolveDirective("motion");
    // return the element with the motion directive applied
    return withDirectives(
      h(
        "div",
        {},
        {
          default: () => [this.$slots.default()]
        }
      ),
      [
        [
          motion,
          {
            // set the initial state
            initial: { opacity: 0, y: 100 },
            enter: {
              // set the enter state and transition
              opacity: 1,
              y: 0,
              transition: {
                delay
              }
            }
          }
        ]
      ]
    );
  }
});
