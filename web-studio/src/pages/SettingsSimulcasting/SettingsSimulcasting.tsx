import { LoadingSpinner, useToggle } from '@noice-com/common-ui';
import toast from 'react-hot-toast';

import { useSimulcastingDestination } from './hooks';
import styles from './SettingsSimulcasting.module.css';
import {
  SimulcastingSettingsDestinationForm,
  SimulcastingSettingsDestinationFormResult,
} from './SimulcastingSettingsDestinationForm';
import { SimulcastingSettingsOverview } from './SimulcastingSettingsOverview';

export function SettingsSimulcasting() {
  const [isFormOpen, _, openForm, closeForm] = useToggle(false);

  const { currentConfig, onUpdateConfig, onDeleteConfig, loading } =
    useSimulcastingDestination();

  const onDelete = async () => {
    await onDeleteConfig();
    closeForm();
    toast.success('Simulcasting destination deleted!');
  };

  const onSave = async (config: SimulcastingSettingsDestinationFormResult) => {
    await onUpdateConfig(config);
    closeForm();
    toast.success('Simulcasting destination saved!');
  };

  const onToggleSimulcastingEnabled = async () => {
    if (!currentConfig) {
      return;
    }

    const newValue = !currentConfig.enabled;
    await onUpdateConfig({ enabled: newValue });
    toast.success(`Simulcasting ${newValue ? 'enabled' : 'disabled'}!`);
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.settingsSimulcastingRoot}>
      <div className={styles.settingsSimulcastingContent}>
        {isFormOpen ? (
          <SimulcastingSettingsDestinationForm
            initialValues={currentConfig}
            onCancel={closeForm}
            onDelete={onDelete}
            onSave={onSave}
          />
        ) : (
          <SimulcastingSettingsOverview
            currentConfig={currentConfig}
            onOpenForm={openForm}
            onToggleSimulcastingEnabled={onToggleSimulcastingEnabled}
          />
        )}
      </div>
    </div>
  );
}
