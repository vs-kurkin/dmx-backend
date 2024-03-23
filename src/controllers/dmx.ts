import DMXService, { type DMXMapValues, type UniverseOptions } from '#services/dmx.ts'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

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
    description: 'Universes id list',
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
  async addUniverse(@Body() options: UniverseOptions) {
    await this.dmx.addUniverse(options)

    return { status: 'success' }
  }

  @Delete('/:id/')
  @ApiOperation({ summary: 'Delete universe' })
  @ApiParam({
    name: 'id',
    description: 'Universe id',
  })
  async deleteUniverse(@Param('id') id: string) {
    await this.dmx.deleteUniverse(id)

    return { status: 'success' }
  }

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
  getValues(@Param('id') universe: string) {
    return this.dmx.getValues(universe)
  }

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
  setValues(@Param('id') universe: string, @Param('value') value: number) {
    this.dmx.updateAll(universe, Number(value))

    return { status: 'success' }
  }

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
  setChannel(@Param('id') universe: string, @Body() values: DMXMapValues) {
    this.dmx.update(universe, values)

    return { status: 'success' }
  }

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
    @Param('address') address: number,
  ) {
    return this.dmx.getValue(universe, Number(address))
  }

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
    this.dmx.setValue(universe, Number(address), Number(value))

    return { status: 'success' }
  }
}
