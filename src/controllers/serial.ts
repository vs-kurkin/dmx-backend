import SerialService from '#services/serial'
import type {SerialDrivers, SerialList, SerialOptions} from '@dmx-cloud/dmx-types'
import {BadRequestException, Controller, Delete, Get, Post} from '@nestjs/common'
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger'
import {RESPONSE_OK} from "#utils/constants"

@Controller('serial')
@ApiTags('Serial')
export default class SerialController {
  protected readonly serialService: SerialService

  /**
   * Constructs a new instance of the serial controller.
   *
   * @param {SerialService} serial The serial service
   */
  constructor(serial: SerialService) {
    this.serialService = serial
  }

  /**
   * Returns a list of serial port info objects.
   *
   * @returns A promise that resolves with an array of serial port info objects
   */
  @Get('/')
  @ApiOperation({
    summary: 'Returns serial ports info',
    description: 'Retrieve a list of serial port info objects',
  })
  @ApiResponse({
    status: 200,
    type: Array,
    description: 'Port info list',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  getList(): Promise<SerialList> {
    return this.serialService.list()
  }

  /**
   * Deletes all serial ports and universes.
   *
   * @returns A promise that resolves when all serial ports and universes have been deleted
   */
  @Delete('/')
  @ApiOperation({
    summary: 'Deletes all serial ports and universes',
    description: 'Delete all serial ports and associated universes',
  })
  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async dropSerial() {
    await this.serialService.dropSerial()

    return RESPONSE_OK
  }

  /**
   * Adds a new serial port and associated universe.
   *
   * @param {SerialOptions} options The serial options
   * @returns A promise that resolves when the serial port and universe have been added
   */
  @Post('/')
  @ApiOperation({
    summary: 'Adds a new serial port and associated universe',
    description: 'Create a new serial port and associated universe',
  })
  @ApiBody({
    type: 'SerialOptions',
    required: true,
    schema: {
      type: 'object',
      properties: {
        driver: {
          type: 'string',
          description: 'The serial driver',
          example: 'serial',
        },
        port: {
          type: 'string',
          description: 'The serial port',
          example: '/dev/ttyUSB0',
        },
        baudrate: {
          type: 'number',
          description: 'The baud rate',
          example: 115200,
        },
        universe: {
          type: 'number',
          description: 'The universe',
          example: 1,
        },
      },
    },
    description: 'Serial options',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async addSerial(options: SerialOptions) {
    await this.serialService.addSerial(options)

    return RESPONSE_OK
  }

  /**
   * Deletes a serial port and its associated universe.
   *
   * @param {string} id The ID of the serial port
   * @returns A promise that resolves when the serial port and universe have been deleted
   */
  @Delete('/:id')
  @ApiOperation({
    summary: 'Deletes a serial port and its associated universe',
    description: 'Delete a serial port and associated universe by ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the serial port',
  })
  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  async deleteSerial(id: string) {
    await this.serialService.deleteSerial(id)

    return RESPONSE_OK
  }

  /**
   * Returns the ID of the current serial port, or `undefined` if there is no current serial port.
   *
   * @returns The ID of the current serial port, or `undefined`
   */
  @Get('/current')
  @ApiOperation({
    summary: 'Returns the ID of the current serial port',
    description: 'Retrieve the ID of the current serial port',
  })
  @ApiResponse({
    status: 200,
    type: String,
    description: 'Current serial port ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  getCurrent() {
    return this.serialService.getCurrent()
  }

  /**
   * Set Current Serial Port
   *
   * Sets the current serial port by ID.
   *
   * @param {string} id The ID of the serial port to set as current
   */
  @Post('/current')
  @ApiOperation({
    summary: 'Set Current Serial Port',
    description: 'Set the current serial port by ID',
  })
  @ApiBody({
    type: String,
    description: 'The ID of the serial port to set as current',
  })
  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  setCurrent(id: string) {
    if (!id) {
      throw new BadRequestException('Serial port ID is required')
    }

    this.serialService.setCurrent(id)

    return RESPONSE_OK
  }

  /**
   * Returns a list of supported serial drivers.
   *
   * @returns A list of supported serial drivers
   */
  @Get('/drivers')
  @ApiOperation({
    summary: 'Returns supported driver list',
    description: 'Retrieve a list of supported serial drivers',
  })
  @ApiResponse({
    status: 200,
    type: Array,
    description: 'Driver list',
  })
  async getDrivers(): Promise<SerialDrivers[keyof SerialDrivers][]> {
    return this.serialService.getDrivers().filter((driver) => driver !== 'null')
  }

}
