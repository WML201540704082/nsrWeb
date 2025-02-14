import mitt from 'mitt'
import type { Emitter } from 'mitt'
const bus: Emitter<any> = mitt()
export default bus
