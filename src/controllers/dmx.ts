import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import DMXService, { type DMXMapValues, type UniverseOptions } from '../services/dmx.js'

@Controller('dmx')
@ApiTags('DMX')
export default class DMXController {
  constructor(private readonly dmx: DMXService) {
    this.dmx = dmx
  }

  @Get('/')
  @ApiOperation({ summary: 'Returns universes list' })
  @ApiResponse({
    status: 200,
    type: Object,
    description: 'Universes name list',
  })
  getUniverses(): string[] {
    return this.dmx.getUniverses()
  }

  @Get('/drivers')
  @ApiOperation({ summary: 'Returns supported driver list' })
  @ApiResponse({
    status: 200,
    type: Object,
    description: 'Driver list',
  })
  getDrivers(): string[] {
    return this.dmx.getDrivers()
  }

  @Delete('/')
  @ApiOperation({ summary: 'Delete all universes' })
  deleteAllUniverses() {
    this.dmx.deleteAllUniverses()

    return { status: 'success' }
  }

  @Post('/')
  @ApiOperation({ summary: 'Add universe' })
  @ApiBody({
    description: 'Universe options',
    type: Object,
  })
  addUniverse(
    @Body() options: UniverseOptions,
  ) {
    this.dmx.addUniverse(options.name, options.driver, options.path)

    return { status: 'success' }
  }

  @Delete('/:name/')
  @ApiOperation({ summary: 'Delete universe' })
  @ApiParam({
    name: 'name',
    description: 'Universe name',
  })
  deleteUniverse(@Param('name') name: string) {
    this.dmx.deleteUniverse(name)

    return { status: 'success' }
  }

  @Get('/:name/values/')
  @ApiOperation({ summary: 'Get DMX values' })
  @ApiParam({
    name: 'name',
    description: 'Universe name',
  })
  @ApiOkResponse({
    description: 'Array of DMX values',
    type: Array,
  })
  getValues(@Param('name') universe: string) {
    return this.dmx.getValues(universe)
  }

  @Post('/:name/values/:value')
  @ApiOperation({ summary: 'Set DMX values' })
  @ApiParam({
    name: 'name',
    description: 'Universe name',
  })
  @ApiParam({
    name: 'value',
    description: 'New DMX channels value',
    type: Number,
  })
  setValues(
    @Param('name') universe: string,
    @Param('value') value: number
  ) {
    this.dmx.updateAll(universe, Number(value))

    return { status: 'success' }
  }

  @Post('/:name/channel/')
  @ApiOperation({ summary: 'Sets several DMX channels' })
  @ApiParam({
    name: 'name',
    description: 'Universe name',
  })
  @ApiBody({
    description: 'New DMX values',
    type: Object,
  })
  setChannel(
    @Param('name') universe: string,
    @Body() values: DMXMapValues,
  ) {
    this.dmx.update(universe, values)

    return { status: 'success' }
  }

  @Get('/:name/channel/:address/value/:value')
  @ApiOperation({ summary: 'Get DMX channel value' })
  @ApiParam({
    name: 'name',
    description: 'Universe name',
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
    @Param('name') universe: string,
    @Param('address') address: number
  ) {
    return this.dmx.getValue(universe, Number(address))
  }

  @Post('/:name/channel/:address/value/:value')
  @ApiOperation({ summary: 'Set DMX channel value' })
  @ApiParam({
    name: 'name',
    description: 'Universe name',
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
    @Param('name') universe: string,
    @Param('address') address: number,
    @Param('value') value: number,
  ) {
    this.dmx.setValue(universe, Number(address), Number(value))

    return { status: 'success' }
  }
}
