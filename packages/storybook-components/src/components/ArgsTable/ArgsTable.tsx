import React, { FC } from 'react';
import { ArgTypes, Args, Globals, includeConditionalArg } from '@storybook/csf';
import { styled } from '@storybook/theming';
import pickBy from 'lodash.pickby';
import { opacify, transparentize, darken, lighten } from 'polished';
import { ArgRow } from './ArgRow';
import { SectionRow } from './SectionRow';
import { ArgType } from '../../types';

const EmptyBlockWrapper = styled.div(({ theme }) => ({
  backgroundColor:
    theme.base === 'light' ? 'rgba(0,0,0,.01)' : 'rgba(255,255,255,.01)',
  borderRadius: theme.appBorderRadius,
  border: `1px dashed ${theme.appBorderColor}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  margin: '25px 0 40px',

  color: transparentize(0.3, theme.color.defaultText),
  fontSize: theme.typography.size.s2,
}));

export const EmptyBlock = (props: any) => (
  <EmptyBlockWrapper {...props} className="docblock-emptyblock" />
);

export const TableWrapper = styled.table<{
  compact?: boolean;
  inAddonPanel?: boolean;
}>(({ theme, compact, inAddonPanel }) => ({
  '&&': {
    // Resets for cascading/system styles
    borderCollapse: 'collapse',
    borderSpacing: 0,
    color: theme.color.defaultText,

    'td, th': {
      padding: 0,
      border: 'none',
      verticalAlign: 'top',
      textOverflow: 'ellipsis',
    },
    // End Resets

    fontSize: theme.typography.size.s2 - 1,
    lineHeight: '20px',
    textAlign: 'left',
    width: '100%',

    // Margin collapse
    marginTop: inAddonPanel ? 0 : 25,
    marginBottom: inAddonPanel ? 0 : 40,

    'thead th:first-of-type, td:first-of-type': {
      // intentionally specify thead here
      width: '25%',
    },

    'th:first-of-type, td:first-of-type': {
      paddingLeft: 20,
    },

    'th:nth-of-type(2), td:nth-of-type(2)': {
      ...(compact
        ? null
        : {
            // Description column
            width: '35%',
          }),
    },

    'td:nth-of-type(3)': {
      ...(compact
        ? null
        : {
            // Defaults column
            width: '15%',
          }),
    },

    'th:last-of-type, td:last-of-type': {
      paddingRight: 20,
      ...(compact
        ? null
        : {
            // Controls column
            width: '25%',
          }),
    },

    th: {
      color:
        theme.base === 'light'
          ? transparentize(0.25, theme.color.defaultText)
          : transparentize(0.45, theme.color.defaultText),
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 15,
      paddingRight: 15,
    },

    td: {
      paddingTop: '10px',
      paddingBottom: '10px',

      '&:not(:first-of-type)': {
        paddingLeft: 15,
        paddingRight: 15,
      },

      '&:last-of-type': {
        paddingRight: 20,
      },
    },

    // Table "block" styling
    // Emphasize tbody's background and set borderRadius
    // Calling out because styling tables is finicky

    // Makes border alignment consistent w/other DocBlocks
    marginLeft: inAddonPanel ? 0 : 1,
    marginRight: inAddonPanel ? 0 : 1,

    [`tr:first-child`]: {
      [`td:first-child, th:first-child`]: {
        borderTopLeftRadius: inAddonPanel ? 0 : theme.appBorderRadius,
      },
      [`td:last-child, th:last-child`]: {
        borderTopRightRadius: inAddonPanel ? 0 : theme.appBorderRadius,
      },
    },

    [`tr:last-child`]: {
      [`td:first-child, th:first-child`]: {
        borderBottomLeftRadius: inAddonPanel ? 0 : theme.appBorderRadius,
      },
      [`td:last-child, th:last-child`]: {
        borderBottomRightRadius: inAddonPanel ? 0 : theme.appBorderRadius,
      },
    },

    tbody: {
      // slightly different than the other DocBlock shadows to account for table styling gymnastics
      boxShadow:
        !inAddonPanel &&
        (theme.base === 'light'
          ? `rgba(0, 0, 0, 0.10) 0 1px 3px 1px,
          ${transparentize(0.035, theme.appBorderColor)} 0 0 0 1px`
          : `rgba(0, 0, 0, 0.20) 0 2px 5px 1px,
          ${opacify(0.05, theme.appBorderColor)} 0 0 0 1px`),
      borderRadius: theme.appBorderRadius,

      // for safari only
      // CSS hack courtesy of https://stackoverflow.com/questions/16348489/is-there-a-css-hack-for-safari-only-not-chrome
      '@media not all and (min-resolution:.001dpcm)': {
        '@supports (-webkit-appearance:none)': {
          borderWidth: 1,
          borderStyle: 'solid',
          ...(inAddonPanel && {
            borderColor: 'transparent',
          }),

          ...(!inAddonPanel && {
            borderColor:
              theme.base === 'light'
                ? transparentize(0.035, theme.appBorderColor)
                : opacify(0.05, theme.appBorderColor),
          }),
        },
      },

      tr: {
        background: 'transparent',
        overflow: 'hidden',
        ...(inAddonPanel
          ? {
              borderTopWidth: 1,
              borderTopStyle: 'solid',
              borderTopColor:
                theme.base === 'light'
                  ? darken(0.1, theme.background.content)
                  : lighten(0.05, theme.background.content),
            }
          : {
              [`&:not(:first-child)`]: {
                borderTopWidth: 1,
                borderTopStyle: 'solid',
                borderTopColor:
                  theme.base === 'light'
                    ? darken(0.1, theme.background.content)
                    : lighten(0.05, theme.background.content),
              },
            }),
      },

      td: {
        background: theme.background.content,
      },
    },
    // End finicky table styling
  },
}));

const ControlHeadingWrapper = styled.span({
  display: 'flex',
  justifyContent: 'space-between',
});

export enum ArgsTableError {
  NO_COMPONENT = 'No component found.',
  ARGS_UNSUPPORTED = 'Args unsupported. See Args documentation for your framework.',
}

export type SortType = 'alpha' | 'requiredFirst' | 'none';
type SortFn = (a: ArgType, b: ArgType) => number;

const sortFns: Record<SortType, SortFn | null> = {
  alpha: (a: ArgType, b: ArgType) => a.name.localeCompare(b.name),
  requiredFirst: (a: ArgType, b: ArgType) =>
    Number(!!b.type?.required) - Number(!!a.type?.required) ||
    a.name.localeCompare(b.name),
  none: undefined,
};

export interface ArgsTableOptionProps {
  updateArgs?: (args: Args) => void;
  compact?: boolean;
  inAddonPanel?: boolean;
  initialExpandedArgs?: boolean;
  sort?: SortType;
}
export interface ArgsTableDataProps {
  rows: ArgTypes;
  args?: Args;
  globals?: Globals;
}

export interface ArgsTableErrorProps {
  error: ArgsTableError;
}
export interface ArgsTableLoadingProps {
  isLoading: true;
}

const rowLoadingData = (key: string) => ({
  key,
  name: 'propertyName',
  description: 'This is a short description',
  control: { type: 'text' },
  table: {
    type: { summary: 'summary' },
    defaultValue: { summary: 'defaultValue' },
  },
});

export const argsTableLoadingData: ArgsTableDataProps = {
  rows: {
    row1: rowLoadingData('row1'),
    row2: rowLoadingData('row2'),
    row3: rowLoadingData('row3'),
  },
};

export type ArgsTableProps = ArgsTableOptionProps &
  (ArgsTableDataProps | ArgsTableErrorProps | ArgsTableLoadingProps);

type Rows = ArgType[];
type Subsection = Rows;
type Section = {
  ungrouped: Rows;
  subsections: Record<string, Subsection>;
};
type Sections = {
  ungrouped: Rows;
  ungroupedSubsections: Record<string, Subsection>;
  sections: Record<string, Section>;
};

const groupRows = (rows: ArgType, sort: SortType) => {
  const sections: Sections = {
    ungrouped: [],
    ungroupedSubsections: {},
    sections: {},
  };
  if (!rows) return sections;

  Object.entries(rows).forEach(([key, row]) => {
    const { category, subcategory } = row?.table || {};
    if (category) {
      const section = sections.sections[category] || {
        ungrouped: [],
        subsections: {},
      };
      if (!subcategory) {
        section.ungrouped.push({ key, ...row });
      } else {
        const subsection = section.subsections[subcategory] || [];
        subsection.push({ key, ...row });
        section.subsections[subcategory] = subsection;
      }
      sections.sections[category] = section;
    } else if (subcategory) {
      const subsection = sections.ungroupedSubsections[subcategory] || [];
      subsection.push({ key, ...row });
      sections.ungroupedSubsections[subcategory] = subsection;
    } else {
      sections.ungrouped.push({ key, ...row });
    }
  });

  // apply sort
  const sortFn = sortFns[sort];

  const sortSubsection = (record: Record<string, Subsection>) => {
    if (!sortFn) return record;
    return Object.keys(record).reduce<Record<string, Subsection>>(
      (acc, cur) => ({
        ...acc,
        [cur]: record[cur].sort(sortFn),
      }),
      {},
    );
  };

  const sorted = {
    ungrouped: sections.ungrouped.sort(sortFn),
    ungroupedSubsections: sortSubsection(sections.ungroupedSubsections),
    sections: Object.keys(sections.sections).reduce<Record<string, Section>>(
      (acc, cur) => ({
        ...acc,
        [cur]: {
          ungrouped: sections.sections[cur].ungrouped.sort(sortFn),
          subsections: sortSubsection(sections.sections[cur].subsections),
        },
      }),
      {},
    ),
  };

  return sorted;
};

/**
 * Wrap CSF's `includeConditionalArg` in a try catch so that invalid
 * conditionals don't break the entire UI. We can safely swallow the
 * error because `includeConditionalArg` is also called in the preview
 * in `prepareStory`, and that exception will be bubbled up into the
 * UI in a red screen. Nevertheless, we log the error here just in case.
 */
const safeIncludeConditionalArg = (
  row: ArgType,
  args: Args,
  globals: Globals,
) => {
  try {
    return includeConditionalArg(row, args, globals);
  } catch (err) {
    return false;
  }
};

/**
 * Display the props for a component as a props table. Each row is a collection of
 * ArgDefs, usually derived from docgen info for the component.
 */
export const ArgsTable: FC<ArgsTableProps> = (props) => {
  if ('error' in props) {
    return (
      <EmptyBlock>
        {props.error}&nbsp;
        <a href="http://storybook.js.org/docs/">Read the docs</a>
      </EmptyBlock>
    );
  }

  const {
    updateArgs,
    compact,
    inAddonPanel,
    initialExpandedArgs,
    sort = 'none',
  } = props;
  const { rows, args, globals } =
    'rows' in props ? props : argsTableLoadingData;

  const groups = groupRows(
    pickBy(
      rows,
      (row) =>
        !row?.table?.disable &&
        safeIncludeConditionalArg(row, args || {}, globals || {}),
    ),
    sort,
  );

  if (
    groups.ungrouped.length === 0 &&
    Object.entries(groups.sections).length === 0 &&
    Object.entries(groups.ungroupedSubsections).length === 0
  ) {
    return (
      <EmptyBlock>
        No inputs found for this component.&nbsp;
        <a
          href="http://storybook.js.org/docs/"
          target="_blank"
          rel="noreferrer"
        >
          Read the docs
        </a>
      </EmptyBlock>
    );
  }

  let colSpan = 1;
  if (updateArgs) colSpan += 1;
  if (!compact) colSpan += 2;
  const expandable = Object.keys(groups.sections).length > 0;

  const common = { updateArgs, compact, inAddonPanel, initialExpandedArgs };

  return (
    <TableWrapper {...{ compact, inAddonPanel }} className="docblock-argstable">
      <thead className="docblock-argstable-head">
        <tr>
          <th>
            <span>Name</span>
          </th>
          {compact ? null : (
            <th>
              <span>Description</span>
            </th>
          )}
          {compact ? null : (
            <th>
              <span>Default</span>
            </th>
          )}
          {updateArgs ? (
            <th>
              <ControlHeadingWrapper>Control</ControlHeadingWrapper>
            </th>
          ) : null}
        </tr>
      </thead>
      <tbody className="docblock-argstable-body">
        {groups.ungrouped.map((row) => (
          <ArgRow
            key={row.key}
            row={row}
            arg={args && args[row.key]}
            {...common}
          />
        ))}

        {Object.entries(groups.ungroupedSubsections).map(
          ([subcategory, subsection]) => (
            <SectionRow
              key={subcategory}
              label={subcategory}
              level="subsection"
              colSpan={colSpan}
            >
              {subsection.map((row) => (
                <ArgRow
                  key={row.key}
                  row={row}
                  arg={args && args[row.key]}
                  expandable={expandable}
                  {...common}
                />
              ))}
            </SectionRow>
          ),
        )}

        {Object.entries(groups.sections).map(([category, section]) => (
          <SectionRow
            key={category}
            label={category}
            level="section"
            colSpan={colSpan}
          >
            {section.ungrouped.map((row) => (
              <ArgRow
                key={row.key}
                row={row}
                arg={args && args[row.key]}
                {...common}
              />
            ))}
            {Object.entries(section.subsections).map(
              ([subcategory, subsection]) => (
                <SectionRow
                  key={subcategory}
                  label={subcategory}
                  level="subsection"
                  colSpan={colSpan}
                >
                  {subsection.map((row) => (
                    <ArgRow
                      key={row.key}
                      row={row}
                      arg={args && args[row.key]}
                      expandable={expandable}
                      {...common}
                    />
                  ))}
                </SectionRow>
              ),
            )}
          </SectionRow>
        ))}
      </tbody>
    </TableWrapper>
  );
};
