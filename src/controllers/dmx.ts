import DMXService, { type DMXMapValues } from '#services/dmx'
import type { SerialOptions } from '@dmx-cloud/dmx-types'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

@Controller('dmx')
@ApiTags('DMX')
export default class DMXController {
  protected readonly dmxService: DMXService

  /**
   * Constructor
   * @param dmx DMX service
   */
  constructor(dmx: DMXService) {
    this.dmxService = dmx
  }

  /**
   * Returns a list of all DMX universe IDs
   * @returns A list of universe IDs
   */
  @Get('/')
  @ApiOperation({ summary: 'Returns universes list' })
  @ApiResponse({
    status: 200,
    type: Object,
    description: 'Universes id list',
  })
  getUniverses() {
    return this.dmxService.getUniverses()
  }

  /**
   * Delete all DMX universes
   */
  @Delete('/')
  @ApiOperation({ summary: 'Delete all universes' })
  deleteAllUniverses() {
    this.dmxService.deleteAllUniverses()
  }

  /**
   * Add a new DMX universe
   * @param options Options for the new universe
   */
  @Post('/')
  @ApiOperation({ summary: 'Add universe' })
  @ApiBody({
    description: 'Universe options',
    type: Object,
  })
  addUniverse(
    @Body() options: SerialOptions
  ) {
    this.dmxService.addUniverse(options)
  }

  /**
   * Delete a DMX universe
   * @param id The ID of the universe to delete
   */
  @Delete('/:id/')
  @ApiOperation({ summary: 'Delete universe' })
  @ApiParam({
    name: 'id',
    description: 'Universe id',
  })
  deleteUniverse(
    @Param('id') id: string
  ) {
    this.dmxService.deleteUniverse(id)
  }

  /**
   * Get the DMX values of a universe
   * @param universe The ID of the universe to get the values of
   * @returns The DMX values of the universe
   */
  @Get('/:id/values/')
  @ApiOperation({ summary: 'Get DMX values' })
  @ApiParam({
    name: 'id',
    description: 'Universe id',
  })
  @ApiOkResponse({
    description: 'Array of DMX values',
    type: Array,
  })
  getValues(
    @Param('id') universe: string
  ) {
    return this.dmxService.getValues(universe)
  }

  /**
   * Set all DMX values of a universe to the same value
   * @param universe The ID of the universe to set the values of
   * @param value The value to set the DMX channels to
   */
  @Patch('/:id/values/:value')
  @ApiOperation({ summary: 'Set DMX values' })
  @ApiParam({
    name: 'id',
    description: 'Universe id',
  })
  @ApiParam({
    name: 'value',
    description: 'New DMX channels value',
    type: Number,
  })
  setValues(
    @Param('id') universe: string,
    @Param('value') value: number
  ) {
    this.dmxService.updateAll(universe, Number(value))
  }

  /**
   * Set multiple DMX channel values
   * @param universe The ID of the universe to set the values of
   * @param values An object with channel numbers as keys and the values to set those channels to
   */
  @Patch('/:id/channel/')
  @ApiOperation({ summary: 'Sets several DMX channels' })
  @ApiParam({
    name: 'id',
    description: 'Universe id',
  })
  @ApiBody({
    description: 'New DMX values',
    type: Object,
  })
  setChannel(
    @Param('id') universe: string,
    @Body() values: DMXMapValues
  ) {
    this.dmxService.update(universe, values)
  }

  /**
   * Get a DMX channel value
   * @param universe The ID of the universe to get the value from
   * @param address The channel address
   * @returns The value of the channel
   */
  @Get('/:id/channel/:address')
  @ApiOperation({ summary: 'Get DMX channel value' })
  @ApiParam({
    name: 'id',
    description: 'Universe id',
  })
  @ApiParam({
    name: 'address',
    description: 'DMX channel address',
    type: Number,
  })
  @ApiOkResponse({
    description: 'DMX channel value',
    type: Number,
  })
  getChannelValue(
    @Param('id') universe: string,
    @Param('address') address: number
  ) {
    return this.dmxService.getValue(universe, Number(address))
  }

  /**
   * Set a DMX channel value
   * @param universe The ID of the universe to set the value of
   * @param address The channel address
   * @param value The value to set the channel to
   * @returns An object with a status key
   */
  @Patch('/:id/channel/:address/value/:value')
  @ApiOperation({ summary: 'Set DMX channel value' })
  @ApiParam({
    name: 'id',
    description: 'Universe id',
  })
  @ApiParam({
    name: 'address',
    description: 'DMX channel address',
    type: Number,
  })
  @ApiParam({
    name: 'value',
    description: 'DMX channel value',
    type: Number,
  })
  setChannelValue(
    @Param('id') universe: string,
    @Param('address') address: number,
    @Param('value') value: number,
  ) {
    this.dmxService.setValue(universe, Number(address), Number(value))
  }
}
