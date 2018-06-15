import { assign } from 'lodash';
import { Parser } from 'expr-eval';
import numeral from 'numeral';

import { AggConfig } from 'ui/vis/agg_config';
import AggConfigResult from 'ui/vis/agg_config_result';
import { uiModules } from 'ui/modules';

const module = uiModules.get('kibana/computed-columns', ['kibana']);

module.controller('ComputedColumnsVisController', ($scope, $element, Private) => {

  const uiStateSort = ($scope.uiState) ? $scope.uiState.get('vis.params.sort') : {};
  assign($scope.vis.params.sort, uiStateSort);

  $scope.sort = $scope.vis.params.sort;
  $scope.$watchCollection('sort', function (newSort) {
    $scope.uiState.set('vis.params.sort', newSort);
  });

  const createExpressionsParams = (formula, row) => {
    let regex = /col\[(\d+)\]/g;
    let myArray;
    let output = {};
    while ((myArray = regex.exec(formula)) !== null) {
      output[`x${myArray[1]}`] = (typeof row[myArray[1]].value === 'number') ?
        numeral(row[myArray[1]].value).value() : row[myArray[1]].value;
    }
    return output;
  };

  const createParser = (computedColumn) => {
    let expression = computedColumn.formula.replace(/col\[\d+\]/g, (value) => {
      let cleanValue = /(\d+)/.exec(value)[1];
      return `x${cleanValue}`;
    });
    return Parser.parse(expression);
  };

  const createColumn = (computedColumn, index) => {
    let newColumn = {aggConfig: new AggConfig($scope.vis, {schema: 'metric', type: 'count'}), title: computedColumn.label};
    newColumn.aggConfig.id = `1.computed-column-${index}`;
    newColumn.aggConfig.key = `computed-column-${index}`;
    return newColumn;
  };

  const createRows = (column, rows, computedColumn) => {
    let parser = createParser(computedColumn);

    return _.map(rows, (row) => {
      let expressionParams = createExpressionsParams(computedColumn.formula, row);
      let value = parser.evaluate(expressionParams);
      let newCell = new AggConfigResult(column.aggConfig, void 0, value, value);

      newCell.toString = () => {
        return (typeof value === 'number' && !isNaN(value)) ? numeral(value).format(computedColumn.format) : value;
      };
      row.push(newCell);
      return row;
    });
  };

  const createTables = (tables, computedColumn, index) => {
    _.forEach(tables, (table) => {
      if (table.tables) {
        createTables(table.tables, computedColumn, index);
        return;
      }

      let newColumn = createColumn(computedColumn, index);
      table.columns.push(newColumn);
      table.rows = createRows(newColumn, table.rows, computedColumn);
    });
  };

  const hideColumns = (tables, hiddenColumns) => {
    if (!hiddenColumns) {
      return;
    }

    let removedCounter = 0;
    _.forEach(hiddenColumns.split(','), (item) => {
      let index = item * 1;
      _.forEach(tables, (table) => {
        table.columns.splice(index - removedCounter, 1);
        _.forEach(table.rows, (row) => {
          row.splice(index - removedCounter, 1);
        });
      });
      removedCounter++;
    });
  };

  const shouldShowPagination = (tables, perPage) => {
    return tables.some(function (table) {
      if (table.tables) {
        return shouldShowPagination(table.tables, perPage);
      }
      else {
        return table.rows.length > perPage;
      }
    });
  };

  $scope.sort = $scope.vis.params.sort;
  $scope.$watchCollection('sort', (newSort) => {
    $scope.uiState.set('vis.params.sort', newSort);
  });

  $scope.$watch('renderComplete', function () {

    let tableGroups = $scope.tableGroups = null;
    let hasSomeRows = $scope.hasSomeRows = null;
    let computedColumns = $scope.vis.params.computedColumns.filter(output => output.enabled);
    let hiddenColumns = $scope.vis.params.hiddenColumns;

    const vis = $scope.vis;
    const params = vis.params;

    if ($scope.esResponse) {
      tableGroups = $scope.esResponse;

      _.forEach(computedColumns, (computedColumn, index) => {
        createTables(tableGroups.tables, computedColumn, index);
      });

      hideColumns(tableGroups.tables, hiddenColumns);

      hasSomeRows = tableGroups.tables.some(function haveRows(table) {
        if (table.tables) return table.tables.some(haveRows);
        return table.rows.length > 0;
      });

      $scope.tableVisContainerClass = {
        'hide-pagination': !shouldShowPagination,
        'hide-export-links': params.hideExportLinks
      };
    }

    $scope.hasSomeRows = hasSomeRows;
    if (hasSomeRows) {
      $scope.tableGroups = tableGroups;
    }

    $scope.renderComplete();
  });

});
