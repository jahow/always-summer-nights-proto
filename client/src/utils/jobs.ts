interface Job {
  callback: Function
  thisObj: any
  timeout?: number
}

// maximum time allowed for jobs in ms
// note: jobs will be run as long as the frame time is under
// this, so we must put the limit lower than 16ms
const MAX_FRAME_TIME = 9

const jobQueue: Job[] = []

/**
 * Adds a job to the job queue
 * @param callback synchronous callback to run
 * @param thisObj will be used as this when executing callback
 * @param timeout time in ms for the job to be removed if not run
 */
export function addJobToQueue(
  callback: Function,
  thisObj: any,
  timeout?: number
) {
  jobQueue.push({
    callback,
    thisObj,
    timeout: timeout || -1
  })
}

/**
 * Will run jobs as long as frame time is available
 */
export function updateJobQueue() {
  let startTime = Date.now()
  while (jobQueue.length) {
    let job = jobQueue.shift()
    job.callback.apply(job.thisObj)

    // stop job execution if the cumulated execution time is above the limit
    if (Date.now() - startTime > MAX_FRAME_TIME) {
      break
    }
  }
}
