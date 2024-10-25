import DeviceService from '#services/device'
import type { Device, DeviceList } from '@dmx-cloud/dmx-types'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

@Controller('device')
@ApiTags('Device')
export default class DeviceController {
  protected readonly deviceService: DeviceService

  /**
   * Create a new DeviceController instance.
   *
   * @param device The service to use for all operations
   */
  constructor(device: DeviceService) {
    this.deviceService = device
  }

  /**
   * Get all devices.
   *
   * @returns List of all devices
   */
  @Get('/')
  @ApiOperation({ summary: 'Returns device list' })
  @ApiResponse({
    status: 200,
    description: 'Map {index: device}',
    type: Object,
  })
  getDevices() {
    return this.deviceService.getDevices()
  }

  /**
   * Delete all devices from the database.
   */
  @Delete('/')
  @ApiOperation({ summary: 'Delete all devices' })
  async removeAll() {
    await this.deviceService.deleteAllDevices()

    return { status: 'success' }
  }

  /**
   * Add a new device to the database.
   *
   * @param device The device to add
   */
  @Post('/')
  @ApiOperation({ summary: 'Add new device' })
  @ApiBody({
    description: 'Device object',
    type: Object,
  })
  @ApiResponse({
    description: 'DMX address of device',
    status: 201,
    type: Number,
  })
  async add(
    @Body() device: Device
  ) {
    await this.deviceService.addDevice(device)
  }

  /**
   * Replace all devices in the database with the given list of devices.
   *
   * @param list List of devices to set
   */
  @Patch('/')
  @ApiOperation({ summary: 'Set bulk devices' })
  @ApiBody({
    description: 'Device list',
    type: Object,
  })
  @ApiResponse({
    status: 201,
  })
  async set(
    @Body() list: DeviceList
  ) {
    await this.deviceService.setDevices(list)
  }

  /**
   * Get a device by index.
   *
   * @param index Index of the device
   * @returns The device at the given index
   */
  @Get('/:index')
  @ApiOperation({ summary: 'Get device' })
  @ApiParam({
    name: 'index',
    description: 'Device index',
  })
  @ApiResponse({
    status: 200,
    description: 'Device object',
    type: Object,
  })
  get(
    @Param('index') index: number
  ) {
    return this.deviceService.getDevice(index)
  }

  /**
   * Update a device in the database.
   *
   * @param index Index of the device to update
   * @param device The updated device
   */
  @Patch('/:index')
  @ApiOperation({ summary: 'Update device' })
  @ApiParam({
    name: 'index',
    description: 'Device index',
  })
  @ApiBody({
    description: 'Device object',
    type: Object,
  })
  async update(
    @Param('index') index: number,
    @Body() device: Device,
  ) {
    await this.deviceService.updateDevice(index, device)
  }

  /**
   * Delete a device by index.
   *
   * @param index Index of the device to delete
   */
  @Delete('/:index/')
  @ApiOperation({ summary: 'Delete device' })
  @ApiParam({
    name: 'index',
    description: 'Device index',
  })
  async remove(
    @Param('index') index: number
  ) {
    await this.deviceService.deleteDevice(index)
  }

  /**
   * Get the total DMX channel count for all devices up to but not including the given index.
   *
   * If no index is given, the total DMX channel count for all devices is returned.
   *
   * @param index Optional index to not include in the count
   * @returns Total DMX channel count
   */
  @Get('/dmx/:index/')
  @ApiParam({
    description: 'Device index',
    name: 'index',
  })
  @ApiOperation({ summary: 'Get DMX channel' })
  getDMXChannel(@Param('index') index: number) {
    return this.deviceService.getNextDMX(index)
  }

}
