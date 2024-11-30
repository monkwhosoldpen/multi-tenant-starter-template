import { Model } from '@nozbe/watermelondb'
import ToDo from './ToDo'

console.log('📚 [Models] Loading model:', ToDo.table)

const models: typeof Model[] = [ToDo]

export default models 