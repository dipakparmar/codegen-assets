import { ScalarTypes, Fieldlike, ITypeMap } from '../types'
import { serialize, isScalar } from '../utils'
import { buildBaseTypes } from '../schemaTools'
import { html as template } from 'common-tags'
import { EnumValueApi } from 'graphql-extra'

const scalarMap = {
  [ScalarTypes.ID]: 'number',
  [ScalarTypes.INT]: 'number',
  [ScalarTypes.FLOAT]: 'number',
  [ScalarTypes.STRING]: 'string',
  [ScalarTypes.BOOLEAN]: 'boolean',
}

const baseTypes = template`
  type Maybe<T> = T | null
`
const fieldFormatter = (field: Fieldlike) => {
  let { name, required, list, type } = serialize(field)
  // let { required, type, name } = field
  let T = isScalar(type) ? scalarMap[type] : type
  // string -> Maybe<string>
  if (!required) T = `Maybe<${T}>`
  // Maybe<string> -> Array<Maybe<string>>
  if (list) T = `Array<${T}>`
  // Array<Maybe<string>> -> Maybe<Array<Maybe<string>>>
  if (!required && list) T = `Maybe<${T}>`
  // username: string -> username?: string
  if (!required) name = `${name}?`
  return { name, type: T }
}

const tsTypeDef = (typeName: string, fields: Fieldlike[]): string => {
  const fieldDefs = fields
    .map(fieldFormatter)
    .map(({ name, type }) => `${name}: ${type}`)
    .join('\n')

  return template`
    type ${typeName} = {
      ${fieldDefs}
    }`
}

const typeMapToTSTypes = (typeMap: ITypeMap) =>
  Object.entries(typeMap.types)
    .map(([typeName, fields]) => tsTypeDef(typeName, fields))
    .join('\n\n')

const tsEnumDef = (typeName: string, fields: EnumValueApi[]): string => {
  const fieldDefs = fields
    .map((field) => `${field.getName()} = '${field.getName()}'`)
    .join(',\n')

  return template`
    enum ${typeName} {
      ${fieldDefs}
    }`
}

const typeMapToTSEnums = (typeMap: ITypeMap) =>
  Object.entries(typeMap.enums)
    .map(([typeName, fields]) => tsEnumDef(typeName, fields))
    .join('\n\n')

const typeMapToTypescript = (typeMap: ITypeMap) =>
  baseTypes +
  '\n\n' +
  typeMapToTSTypes(typeMap) +
  '\n\n' +
  typeMapToTSEnums(typeMap)

export const graphqlSchemaToTypescript = (schema: string) =>
  typeMapToTypescript(buildBaseTypes(schema))
