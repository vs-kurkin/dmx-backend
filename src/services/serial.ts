import { Injectable } from '@nestjs/common'
import { SerialPort } from 'serialport'

@Injectable()
export default class SerialService {
  list() {
    return SerialPort.list()
  }
}
