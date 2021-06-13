const cluster = require('cluster')
const os = require('os')

function enableCluster() {
    let clusterCpus = os.cpus().length
    console.log(`[!] CPUS available ${clusterCpus}`)
    for (let i = 0; i < clusterCpus; i++) {
        console.info(`[!] Fork CPU ${i + 1}`)
        cluster.fork()
    }
}

if (cluster.isMaster) {
    enableCluster()
} else {
    require('./server')
}
