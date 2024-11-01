interface FontColors {
  reset: string
  red: string
  green: string
  yellow: string
  blue: string
}

const fontColors: FontColors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

const getFormattedDateTime = (): string => new Date().toISOString()

const error = (s: string): void => console.error(`${getFormattedDateTime()}\t${fontColors.red}ERROR${fontColors.reset}\t${s}`)

const info = (s: string): void => console.info(`${getFormattedDateTime()}\t${fontColors.green}INFO${fontColors.reset}\t${s}`)

const log = (s: string): void => console.log(`${getFormattedDateTime()}\t${fontColors.blue}LOG${fontColors.reset}\t${s}`)

const warn = (s: string): void => console.warn(`${getFormattedDateTime()}\t${fontColors.yellow}WARN${fontColors.reset}\t${s}`)

const debug = (s: string): void => console.debug(`${getFormattedDateTime()}\t${fontColors.blue}DEBUG${fontColors.reset}\t${s}`)

export { error, info, log, warn, debug }
