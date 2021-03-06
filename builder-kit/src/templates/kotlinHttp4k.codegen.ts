import { graphqlSchemaToKotlin } from '../languages-functional/kotlin'
import { kotlinHttp4kTemplate } from '.'
import { buildActionTypes } from '../schemaTools'
import { DeriveParams } from '../types'

const templater = (
  actionName: string,
  actionSdl: string,
  derive: DeriveParams | null
) => {
  const actionParams = buildActionTypes(actionName, actionSdl)
  const codegen = kotlinHttp4kTemplate({ ...actionParams, derive })
  const response = [
    {
      name: actionName + '.kt',
      content: codegen,
    },
    {
      name: actionName + 'Types.kt',
      content: graphqlSchemaToKotlin(actionSdl),
    },
  ]
  return response
}

globalThis.templater = templater
