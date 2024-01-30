import { DiamondIcon, Fingerprint, Hash, Key, Table2 } from 'lucide-react'
import { Handle, NodeProps } from 'reactflow'
import { cn } from 'ui'
import { NODE_WIDTH } from './SchemaFlow.constants'

// Constants for node styles
const HIDDEN_NODE_CONNECTOR = '!h-px !w-px !min-w-0 !min-h-0 !cursor-grab !border-0 !opacity-0';
const ITEM_HEIGHT = 'h-[22px]';
const FLEX_SHRINK_TEXT_LIGHT = 'flex-shrink-0 text-light';

const generateHandle = (id: string, position: 'target' | 'source', positionClass: string) => (
  <Handle
    type={position}
    id={id}
    position={position}
    className={positionClass}
    aria-label={`${position} handle for ${id}`} // Enhance accessibility
  />
);

export type TableNodeData = {
  name: string;
  isForeign: boolean;
  columns: Array<{
    id: string;
    isPrimary: boolean;
    isNullable: boolean;
    isUnique: boolean;
    isIdentity: boolean;
    name: string;
    format: string;
  }>;
};

/**
 * `TableNode` component represents a visual node within a schema flow diagram.
 * It can render both local and foreign table nodes, displaying table names, columns,
 * and various column properties using icons. The component supports interactive elements
 * for establishing connections between nodes within the schema flow.
 * 
 * It can gracefully handle `null` or `undefined` `data`, ensuring the component's robustness
 * in various usage scenarios.
 */
const TableNode = ({ data, targetPosition, sourcePosition }: NodeProps<TableNodeData>) => {
  if (!data) {
    return null;  // Return `null` if `data` is null or undefined.
  }
  if (data.isForeign) {
    return <ForeignTableNode data={data} targetPosition={targetPosition} />;
  }

  return <LocalTableNode data={data} targetPosition={targetPosition} sourcePosition={sourcePosition} />;
};

const ForeignTableNode = ({ data, targetPosition }) => (
  <div className="rounded-lg">
    <header className="text-[0.5rem] leading-5 font-bold px-2 text-center bg-brand text-gray-300">
      {data.name}
{targetPosition && generateHandle(data.name, 'target', cn(HIDDEN_NODE_CONNECTOR, '!left-0'))}
    </header>
  </div>
);



/**
 * Renders a local table node within a schema flow diagram.
 *
 * This component is responsible for visually representing a local table, including its name, columns,
 * and their respective properties. It supports interactive elements such as handles, allowing connections
 * between nodes within the schema flow based on the table's relationships.
 *
 * @param {TableNodeData} data - An object containing the table's name, an indication if it is a foreign table,
 * and an array of column objects detailing the column name, properties and format.
 * @param {'top' | 'bottom' | 'left' | 'right' | undefined} targetPosition - Designates the position of the target handle within the node for incoming connections.
 * @param {'top' | 'bottom' | 'left' | 'right' | undefined} sourcePosition - Specifies the position of the source handle within the node for outgoing connections.
 * @returns A JSX element representing the local table node with appropriately placed handles for establishing connections, if `targetPosition` or `sourcePosition` are provided.
 */
const LocalTableNode = ({ data, targetPosition, sourcePosition }) => (
  <div
    className="border border-[0.5px] overflow-hidden rounded-[4px] shadow-sm"
    style={{ width: NODE_WIDTH / 2 }}
  >
    <header
      className={cn(
        'text-[0.55rem] px-2 bg-alternative text-default flex gap-1 items-center',
        ITEM_HEIGHT
      )}
    >
      <Table2 strokeWidth={1} size={12} className="text-light" />
      {data.name}
    </header>

    {data.columns && data.columns.map((column) => (
      <div
        className={cn(
          'text-[8px] leading-5 relative flex flex-row justify-items-start',
          'bg-surface-100',
          'border-t',
          'border-t-[0.5px]',
          'hover:bg-scale-500 transition cursor-default',
          ITEM_HEIGHT
        )}
        key={column.id}
      >
        <div className="gap-[0.24rem] flex mx-2 align-middle basis-1/5 items-center justify-start">
          {column.isPrimary && (
            <Key size={8} strokeWidth={1} className={FLEX_SHRINK_TEXT_LIGHT} />
          )}
          {column.isNullable && (
            <DiamondIcon size={8} strokeWidth={1} className={FLEX_SHRINK_TEXT_LIGHT} />
          )}
          {!column.isNullable && (
            <DiamondIcon
              size={8}
              strokeWidth={1}
              fill="currentColor"
              className={FLEX_SHRINK_TEXT_LIGHT}
            />
          )}
          {column.isUnique && (
            <Fingerprint size={8} strokeWidth={1} className={FLEX_SHRINK_TEXT_LIGHT} />
          )}
          {column.isIdentity && (
            <Hash size={8} strokeWidth={1} className={FLEX_SHRINK_TEXT_LIGHT} />
          )}
        </div>
        <div className="flex w-full justify-between">
          <span className="text-ellipsis overflow-hidden whitespace-nowrap">
            {column.name}
          </span>
          <span className="px-2 inline-flex justify-end font-mono text-lighter text-[0.4rem]">
            {column.format}
          </span>
        </div>
{targetPosition && generateHandle(column.id, 'target', cn(HIDDEN_NODE_CONNECTOR, '!left-0'))}
{sourcePosition && generateHandle(column.id, 'source', cn(HIDDEN_NODE_CONNECTOR, '!right-0'))}
      </div>
    ))}
  </div>
);

export default TableNode;
