import test from 'tape'
import {
  Bendec,
  fastReaders,
  fastWriters,
} from '../'
import { TypeDefinition, Kind } from '../types'
import { MsgType, types, enums, unions } from './fixtures'
import { Uri, User, Header, UserAdd } from './types'

test('Validate test', t => {

  const bendec = new Bendec<any>({
    readers: fastReaders,
    writers: fastWriters,
  })

  bendec.addTypes(types)

  const user = {
    firstName: 'Genezyp',
    age: 45,
    uri: {
      protocol: 'https',
      host: '127.0.0.1',
    }
  }

  bendec.encodeAs(user, 'User')
  t.end()
})
