$file = "D:\work\litellm_fork\litellm-bit\ui\litellm-dashboard\src\components\policies\pipeline_flow_builder.tsx"
$content = [System.IO.File]::ReadAllText($file)

# 1. Connector: ({ onInsert }) => (  ->  ({ onInsert }) => { ... return (
$content = $content.Replace(
  "const Connector: React.FC<ConnectorProps> = ({ onInsert }) => (`n",
  "const Connector: React.FC<ConnectorProps> = ({ onInsert }) => {`n  const { t } = useTranslations(`"common`");`n  return (`n"
)

# 2. StepCard: after ) => { at line with "availableGuardrails,"
$content = $content.Replace(
  "  availableGuardrails,`n}) => {`n",
  "  availableGuardrails,`n}) => {`n  const { t } = useTranslations(`"common`");`n"
)

# 3. PipelineFlowBuilder: after ) => {
$content = $content.Replace(
  "const PipelineFlowBuilder: React.FC<PipelineFlowBuilderProps> = ({ pipeline, onChange, availableGuardrails }) => {`n",
  "const PipelineFlowBuilder: React.FC<PipelineFlowBuilderProps> = ({ pipeline, onChange, availableGuardrails }) => {`n  const { t } = useTranslations(`"common`");`n"
)

# 4. PipelineInfoDisplay: ({ pipeline }) => (  ->  ({ pipeline }) => { ... return (
$content = $content.Replace(
  "export const PipelineInfoDisplay: React.FC<PipelineInfoDisplayProps> = ({ pipeline }) => (`n",
  "export const PipelineInfoDisplay: React.FC<PipelineInfoDisplayProps> = ({ pipeline }) => {`n  const { t } = useTranslations(`"common`");`n  return (`n"
)

[System.IO.File]::WriteAllText($file, $content)
Write-Output "Done"
