import 'plugins/computed-columns/computed-columns.less';
import 'plugins/computed-columns/computed-columns-vis-controller';
import 'plugins/computed-columns/computed-columns-params';
import computedTableVisTemplate from 'plugins/computed-columns/computed-columns-vis.html';

import 'ui/agg_table';
import 'ui/agg_table/agg_table_group';
import {CATEGORY} from 'ui/vis/vis_category';
import { Schemas } from 'ui/vis/editors/default/schemas';
import {VisFactoryProvider} from 'ui/vis/vis_factory';
import {VisTypesRegistryProvider} from 'ui/registry/vis_types';

VisTypesRegistryProvider.register(ComputedTableVisTypeProvider);

function ComputedTableVisTypeProvider(Private) {
  const VisFactory = Private(VisFactoryProvider);

  return VisFactory.createAngularVisualization({
    type: 'table',
    name: 'computed-columns',
    title: 'Computed Cols',
    icon: 'fa-table',
    description: 'Same functionality than Data Table, but after data processing, computed columns can be added with math expressions.',
    category: CATEGORY.DATA,
    visConfig: {
      defaults: {
        perPage: 10,
        showPartialRows: false,
        showMeticsAtAllLevels: false,
        sort: {
          columnIndex: null,
          direction: null
        },
        showTotal: false,
        totalFunc: 'sum',
        computedColumns: [{
          formula: 'col[0] * col[0]',
          label: 'Value squared',
          format: '0,0.[00]',
          enabled: true
        }],
        hideExportLinks: false
      },
      template: computedTableVisTemplate,
    },
    editorConfig: {
      optionsTemplate: '<computed-table-vis-params></computed-table-vis-params>',
      schemas: new Schemas([
      {
        group: 'metrics',
        name: 'metric',
        title: 'Metric',
        aggFilter: ['!geo_centroid', '!geo_bounds'],
        min: 1,
        defaults: [
          { type: 'count', schema: 'metric' }
        ]
      },
      {
        group: 'buckets',
        name: 'bucket',
        title: 'Split Rows',
        aggFilter: ['!filter']
      },
      {
        group: 'buckets',
        name: 'split',
        title: 'Split Table',
        aggFilter: ['!filter']
      }
    ])
    },
    responseHandlerConfig: {
      asAggConfigResults: true
    },
    hierarchicalData: function (vis) {
      return Boolean(vis.params.showPartialRows || vis.params.showMeticsAtAllLevels);
    }
  });
}

export default ComputedTableVisTypeProvider;