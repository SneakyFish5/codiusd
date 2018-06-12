import * as Hapi from 'hapi'
import { Injector } from 'reduct'
import PodDatabase from '../services/PodDatabase'
import PodManager from '../services/PodManager'
import PeerDatabase from '../services/PeerDatabase'
import * as os from 'os'
import Config from '../services/Config'
import { MEGABYTE_SIZE } from '../util/podResourceCheck'
import LooseObject from '../common/looseObject'

export default function (server: Hapi.Server, deps: Injector) {
  const peerDb = deps(PeerDatabase)
  const podDatabase = deps(PodDatabase)
  const podManager = deps(PodManager)

  const config = deps(Config)

  async function infoHandler (request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const fullMem = podManager.getMemoryUsed() * MEGABYTE_SIZE / os.totalmem() >= config.maxMemoryFraction
    const infoResp: LooseObject = {
      fullMem,
      numPeers: peerDb.getNumPeers(),
      currency: config.hostCurrency,
      costPerMonth: config.hostCostPerMonth,
      uri: request.server.info.uri
    }
    const hapiQuery = JSON.parse(JSON.stringify(request.query))
    if (config.showAdditionalHostInfo) {
      infoResp.runningContracts = podDatabase.getRunningPods().length
      // TODO: add other information which is interesting, like uptime, etc?
      if (hapiQuery && hapiQuery.requestPeers === 'true') {
        infoResp.peers = peerDb.getAllPeers()
      }
    }
    return infoResp
  }

  server.route({
    method: 'get',
    path: '/host-info',
    handler: infoHandler
  })
}
