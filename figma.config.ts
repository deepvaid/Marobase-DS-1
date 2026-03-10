/**
 * Figma Code Connect — Root Configuration
 *
 * Maps each Mp* Vue component to its Figma node.
 * Fill in `figmaNodeUrl` values once the Figma file exists.
 *
 * Usage:
 *   FIGMA_TOKEN=<your-token> npm run design-kit:push-connect
 *
 * @see https://github.com/figma/code-connect
 */
export default {
  /**
   * Figma file key — extract from your Figma file URL:
   * figma.com/design/<FILE_KEY>/...
   */
  figmaFileKey: 'REPLACE_WITH_FIGMA_FILE_KEY',

  components: [
    {
      /** Figma component name / page node */
      figma: 'MpPageHeader',
      /** Path to the Vue source component */
      code: 'src/components/MpPageHeader.vue',
      /**
       * Full Figma node URL — right-click component in Figma → "Copy link to selection"
       * e.g. https://www.figma.com/design/<fileKey>/<fileName>?node-id=<nodeId>
       */
      figmaNodeUrl: 'REPLACE_WITH_FIGMA_NODE_URL',
      props: {
        title:      { kind: 'string',  figmaPropName: 'Title' },
        subtitle:   { kind: 'string',  figmaPropName: 'Subtitle' },
      },
    },
    {
      figma: 'MpKpiCard',
      code: 'src/components/MpKpiCard.vue',
      figmaNodeUrl: 'REPLACE_WITH_FIGMA_NODE_URL',
      props: {
        label:         { kind: 'string',  figmaPropName: 'Label' },
        value:         { kind: 'string',  figmaPropName: 'Value' },
        trend:         { kind: 'string',  figmaPropName: 'Trend' },
        trendPositive: { kind: 'boolean', figmaPropName: 'TrendPositive' },
        icon:          { kind: 'string',  figmaPropName: 'Icon' },
        color:         { kind: 'string',  figmaPropName: 'Color' },
      },
    },
    {
      figma: 'MpStatusChip',
      code: 'src/components/MpStatusChip.vue',
      figmaNodeUrl: 'REPLACE_WITH_FIGMA_NODE_URL',
      props: {
        status:   { kind: 'string', figmaPropName: 'Status' },
        type:     { kind: 'enum',   figmaPropName: 'Type',
          options: ['order', 'fulfillment', 'payment', 'campaign', 'contact', 'ticket', 'coupon', 'general'] },
        showIcon: { kind: 'boolean', figmaPropName: 'ShowIcon' },
      },
    },
    {
      figma: 'MpDataTableToolbar',
      code: 'src/components/MpDataTableToolbar.vue',
      figmaNodeUrl: 'REPLACE_WITH_FIGMA_NODE_URL',
      props: {
        searchPlaceholder: { kind: 'string', figmaPropName: 'SearchPlaceholder' },
      },
    },
    {
      figma: 'MpEmptyState',
      code: 'src/components/MpEmptyState.vue',
      figmaNodeUrl: 'REPLACE_WITH_FIGMA_NODE_URL',
      props: {
        icon:        { kind: 'string', figmaPropName: 'Icon' },
        title:       { kind: 'string', figmaPropName: 'Title' },
        description: { kind: 'string', figmaPropName: 'Description' },
        actionLabel: { kind: 'string', figmaPropName: 'ActionLabel' },
      },
    },
    {
      figma: 'MpFilterTabs',
      code: 'src/components/MpFilterTabs.vue',
      figmaNodeUrl: 'REPLACE_WITH_FIGMA_NODE_URL',
      props: {},
    },
    {
      figma: 'MpFloatingBulkBar',
      code: 'src/components/MpFloatingBulkBar.vue',
      figmaNodeUrl: 'REPLACE_WITH_FIGMA_NODE_URL',
      props: {
        count: { kind: 'number', figmaPropName: 'Count' },
      },
    },
    {
      figma: 'MpFormDrawer',
      code: 'src/components/MpFormDrawer.vue',
      figmaNodeUrl: 'REPLACE_WITH_FIGMA_NODE_URL',
      props: {
        title:    { kind: 'string', figmaPropName: 'Title' },
        subtitle: { kind: 'string', figmaPropName: 'Subtitle' },
        width:    { kind: 'number', figmaPropName: 'Width' },
      },
    },
    {
      figma: 'MpSectionHeader',
      code: 'src/components/MpSectionHeader.vue',
      figmaNodeUrl: 'REPLACE_WITH_FIGMA_NODE_URL',
      props: {
        title: { kind: 'string', figmaPropName: 'Title' },
      },
    },
  ],
}
