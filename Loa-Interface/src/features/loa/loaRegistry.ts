import { loaClient, type LoaResult } from '@/lib/loaClient'

export type FieldType = 'string' | 'number' | 'boolean' | 'textarea'

export type ToolField = {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  helperText?: string
  required?: boolean
  defaultValue?: string | number | boolean
}

export type ToolCategoryId =
  | 'strings'
  | 'dates'
  | 'permutation'
  | 'ids'
  | 'golden'
  | 'fibonacci'
  | 'markdown'

export type ToolConfig = {
  id: string
  category: ToolCategoryId
  label: string
  description: string
  fields: ToolField[]
  run: (values: Record<string, unknown>) => LoaResult<unknown>
}

export const tools: ToolConfig[] = [
  {
    id: 'capitalize',
    category: 'strings',
    label: 'Capitalize',
    description: 'Capitalize the first letter of a string.',
    fields: [
      {
        name: 'value',
        label: 'Input',
        type: 'string',
        placeholder: 'Hello world',
        required: true,
      },
    ],
    run: (values) =>
      loaClient.capitalize({
        value: (values.value as string) ?? '',
      }),
  },
  {
    id: 'stringToSlug',
    category: 'strings',
    label: 'String to slug',
    description: 'Convert a string into a URL-friendly slug.',
    fields: [
      {
        name: 'value',
        label: 'Input',
        type: 'string',
        placeholder: 'Hôtel & Spa, all inclusive.',
        required: true,
      },
    ],
    run: (values) =>
      loaClient.stringToSlug({
        value: (values.value as string) ?? '',
      }),
  },
  {
    id: 'updateString',
    category: 'strings',
    label: 'Update string',
    description: 'Replace a pattern inside a string (literal or RegExp).',
    fields: [
      {
        name: 'source',
        label: 'Source',
        type: 'textarea',
        placeholder: 'The quick brown fox jumps over the lazy dog.',
        required: true,
      },
      {
        name: 'pattern',
        label: 'Pattern',
        type: 'string',
        placeholder: 'fox',
        required: true,
      },
      {
        name: 'replacement',
        label: 'Replacement',
        type: 'string',
        placeholder: 'cat',
        required: true,
      },
      {
        name: 'useRegex',
        label: 'Use RegExp (global)',
        type: 'boolean',
        defaultValue: false,
        helperText: 'Enable to interpret pattern as a regular expression.',
      },
    ],
    run: (values) =>
      loaClient.updateString({
        source: (values.source as string) ?? '',
        pattern: (values.pattern as string) ?? '',
        replacement: (values.replacement as string) ?? '',
        useRegex: Boolean(values.useRegex),
      }),
  },
  {
    id: 'dateToTimestamp',
    category: 'dates',
    label: 'Date to timestamp',
    description: 'Convert a date string into a timestamp array.',
    fields: [
      {
        name: 'value',
        label: 'Date',
        type: 'string',
        placeholder: '2026-03-03T10:15:00Z',
        required: true,
      },
    ],
    run: (values) =>
      loaClient.dateToTimestamp({
        value: (values.value as string) ?? '',
      }),
  },
  {
    id: 'permutation',
    category: 'permutation',
    label: 'Permutation',
    description:
      'Permute items using a numeric pattern like [14,23,32,41].',
    fields: [
      {
        name: 'items',
        label: 'Items (comma separated)',
        type: 'string',
        placeholder: 'item1,item2,item3,item4',
        required: true,
      },
      {
        name: 'pattern',
        label: 'Pattern (comma separated numbers)',
        type: 'string',
        placeholder: '14,23,32,41',
        required: true,
      },
    ],
    run: (values) =>
      loaClient.permutation({
        items: ((values.items as string) ?? '')
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean),
        pattern: ((values.pattern as string) ?? '')
          .split(',')
          .map((v) => Number(v.trim()))
          .filter((n) => !Number.isNaN(n)),
      }),
  },
  {
    id: 'splitUUIDAndPrefixed',
    category: 'ids',
    label: 'Split UUID & prefix',
    description: 'Generate a short id from UUID or string with optional prefix.',
    fields: [
      {
        name: 'uuid',
        label: 'UUID or value',
        type: 'string',
        placeholder: 'd3da48a57-18a805cb3dce-c9d52491401',
        required: true,
      },
      {
        name: 'prefix',
        label: 'Prefix (optional)',
        type: 'string',
        placeholder: 'jercom',
      },
    ],
    run: (values) =>
      loaClient.splitUUIDAndPrefixed({
        uuid: (values.uuid as string) ?? '',
        prefix: (values.prefix as string) || undefined,
      }),
  },
  {
    id: 'goldenRatioRound',
    category: 'golden',
    label: 'Golden ratio round',
    description: 'Return phi and phi(r) values and related constants.',
    fields: [],
    run: () => loaClient.goldenRatioRound(),
  },
  {
    id: 'fibonacciRectDraw',
    category: 'fibonacci',
    label: 'Fibonacci rectangle',
    description: 'Compute styles for a Fibonacci rectangle.',
    fields: [
      {
        name: 'width',
        label: 'Width',
        type: 'string',
        placeholder: '300px or 300',
        required: true,
      },
      {
        name: 'borderStyle',
        label: 'Border',
        type: 'string',
        placeholder: '1px solid #999',
      },
      {
        name: 'borderRadiusStyle',
        label: 'Border radius',
        type: 'string',
        placeholder: '0',
      },
      {
        name: 'bgStyle',
        label: 'Background',
        type: 'string',
        placeholder: '#999',
      },
      {
        name: 'transformStyle',
        label: 'Transform',
        type: 'string',
        placeholder: 'none',
      },
    ],
    run: (values) =>
      loaClient.fibonacciRectDraw({
        width: (values.width as string) ?? '',
        borderStyle: (values.borderStyle as string) || undefined,
        borderRadiusStyle: (values.borderRadiusStyle as string) || undefined,
        bgStyle: (values.bgStyle as string) || undefined,
        transformStyle: (values.transformStyle as string) || undefined,
      }),
  },
  {
    id: 'strBetweenSpecialChar',
    category: 'markdown',
    label: 'String between special chars',
    description:
      'Wrap text between markers (like ##text##) with a given HTML tag.',
    fields: [
      {
        name: 'pattern',
        label: 'Pattern',
        type: 'textarea',
        placeholder: '##Text with style## and more text.',
        required: true,
      },
      {
        name: 'char',
        label: 'Marker',
        type: 'string',
        placeholder: '##',
        defaultValue: '##',
      },
      {
        name: 'tagBoolean',
        label: 'Enable tag option',
        type: 'boolean',
        defaultValue: true,
      },
      {
        name: 'tagName',
        label: 'HTML tag',
        type: 'string',
        placeholder: 'span',
        defaultValue: 'span',
      },
    ],
    run: (values) =>
      loaClient.strBetweenSpecialChar({
        pattern: (values.pattern as string) ?? '',
        char: (values.char as string) || '##',
        tagBoolean: values.tagBoolean !== false,
        tagName: (values.tagName as string) || 'span',
      }),
  },
]

export const categories = [
  { id: 'strings', label: 'Strings' },
  { id: 'dates', label: 'Dates' },
  { id: 'permutation', label: 'Permutation' },
  { id: 'ids', label: 'IDs' },
  { id: 'golden', label: 'Golden ratio' },
  { id: 'fibonacci', label: 'Fibonacci rect' },
  { id: 'markdown', label: 'Markdown tags' },
] as const

