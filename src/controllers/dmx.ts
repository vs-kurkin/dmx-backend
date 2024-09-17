import DMXService, { type DMXMapValues } from '#services/dmx'
import type { SerialOptions } from '@dmx-cloud/dmx-types'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

@Controller('dmx')
@ApiTags('DMX')
export default class DMXController {
  private readonly dmxService: DMXService

  constructor(dmx: DMXService) {
    this.dmxService = dmx
  }

  @Get('/')
  @ApiOperation({ summary: 'Returns universes list' })
  @ApiResponse({
    status: 200,
    type: Object,
    description: 'Universes id list',
  })
  getUniverses(): string[] {
    return this.dmxService.getUniverses()
  }

  @Delete('/')
  @ApiOperation({ summary: 'Delete all universes' })
  deleteAllUniverses() {
    this.dmxService.deleteAllUniverses()

    return { status: 'success' }
  }

  @Post('/')
  @ApiOperation({ summary: 'Add universe' })
  @ApiBody({
    description: 'Universe options',
    type: Object,
  })
  addUniverse(@Body() options: SerialOptions) {
    this.dmxService.addUniverse(options)

    return { status: 'success' }
  }

  @Delete('/:id/')
  @ApiOperation({ summary: 'Delete universe' })
  @ApiParam({
    name: 'id',
    description: 'Universe id',
  })
  deleteUniverse(@Param('id') id: string) {
    this.dmxService.deleteUniverse(id)

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
    return this.dmxService.getValues(universe)
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
    this.dmxService.updateAll(universe, Number(value))

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
    this.dmxService.update(universe, values)

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
    return this.dmxService.getValue(universe, Number(address))
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
    this.dmxService.setValue(universe, Number(address), Number(value))

    return { status: 'success' }
  }
}
