import { ReasonTree, TreeNode } from '../../reasons';

import styles from './ReasonList.module.css';

import { RadioButton } from '@common-components';

interface Props {
  reasonList: ReasonTree<TreeNode[]>;
  selectedReasonIndex: number | undefined;
  onReasonSelect: (i: number) => void;
}

export const ReasonList = ({
  reasonList,
  selectedReasonIndex,
  onReasonSelect,
}: Props) => (
  <>
    <span className={styles.reasonListLabel}>{reasonList.label}</span>

    <ul className={styles.reasonList}>
      {reasonList.nodes.map((node, i) => (
        <li
          className={styles.reason}
          key={node.label}
        >
          <RadioButton
            checked={i === selectedReasonIndex}
            direction="rtl"
            label={node.label}
            name="reason"
            value={node.label}
            onChange={() => onReasonSelect(i)}
          />
        </li>
      ))}
    </ul>
  </>
);
