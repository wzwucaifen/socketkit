import * as Packages from './packages.js'

export const groupByApplication = async (
  { request: { account_id } },
  callback,
) => {
  try {
    callback(null, {
      rows: await Packages.groupByApplication({ account_id }),
    })
  } catch (error) {
    callback(error)
  }
}

export const findPackages = async (
  { request: { account_id, application_id } },
  callback,
) => {
  try {
    callback(null, {
      rows: await Packages.findAll({ account_id, application_id }, { limit: 10 }),
    })
  } catch (error) {
    callback(error)
  }
}
