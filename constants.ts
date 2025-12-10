import { ProcessPhase } from './types';

export const PROCESS_DATA: ProcessPhase[] = [
  {
    id: 'pre-initiation',
    title: 'Pre-Initiation',
    color: 'bg-green-100',
    borderColor: 'border-green-500',
    textColor: 'text-green-800',
    nodes: [
      {
        id: 'business-needs',
        label: 'Business needs document',
        type: 'document'
      },
      {
        id: 'go-nogo-1',
        label: 'Go / No Go',
        type: 'decision'
      },
      {
        id: 'business-case',
        label: 'Business Case',
        type: 'document'
      },
      {
        id: 'benefits-plan',
        label: 'Benefits Management Plan',
        type: 'document'
      },
      {
        id: 'go-nogo-2',
        label: 'Go / No Go',
        type: 'decision'
      }
    ]
  },
  {
    id: 'initiation',
    title: 'Initiation',
    color: 'bg-purple-100',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-800',
    nodes: [
      {
        id: 'project-charter',
        label: 'Project Charter',
        type: 'document'
      },
      {
        id: 'identify-stakeholders',
        label: 'Identify Stakeholders',
        type: 'activity'
      },
      {
        id: 'create-stakeholder-register',
        label: 'Create Stakeholder Register',
        type: 'document'
      }
    ]
  },
  {
    id: 'planning',
    title: 'Planning',
    color: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-800',
    nodes: [
      {
        id: 'pm-plan-start',
        label: 'Project Management Plan (Initial)',
        type: 'document',
        subItems: [
          { id: 'req-plan', label: 'Requirements Mgmt Plan', type: 'document' },
          { id: 'scope-plan', label: 'Scope Mgmt Plan', type: 'document' },
          { id: 'quality-plan', label: 'Quality Mgmt Plan', type: 'document' },
          { id: 'stakeholder-plan', label: 'Stakeholder Engagement Plan', type: 'document' },
          { id: 'comm-plan', label: 'Communication Mgmt Plan', type: 'document' },
        ]
      },
      {
        id: 'scope-group',
        label: 'Scope Management',
        type: 'group',
        subItems: [
          { id: 'collect-reqs', label: 'Collect Requirements', type: 'activity' },
          { id: 'define-scope', label: 'Define Project Scope', type: 'activity' },
          { id: 'create-scope-statement', label: 'Create Project Scope Statement', type: 'document' },
          { id: 'create-wbs', label: 'Create WBS', type: 'activity' },
          { id: 'wbs-dictionary', label: 'Create WBS Dictionary', type: 'document' }
        ]
      },
      {
        id: 'schedule-group',
        label: 'Schedule Management',
        type: 'group',
        subItems: [
          { id: 'schedule-plan', label: 'Schedule Mgmt Plan', type: 'document' },
          { id: 'define-activities', label: 'Decomposition / Create Activity List', type: 'activity' },
          { id: 'sequence-activities', label: 'Sequence Project Activities', type: 'activity' },
          { id: 'estimate-duration', label: 'Estimate Activity Durations', type: 'activity' },
          { id: 'develop-schedule', label: 'Create Project Schedule', type: 'activity' }
        ]
      },
      {
        id: 'cost-group',
        label: 'Cost Management',
        type: 'group',
        subItems: [
          { id: 'cost-plan', label: 'Cost Mgmt Plan', type: 'document' },
          { id: 'estimate-costs', label: 'Estimate Cost for Activities', type: 'activity' },
          { id: 'determine-budget', label: 'Compute Project Budget', type: 'activity' },
          { id: 'funding-req', label: 'Draw Funding Requirement', type: 'document' }
        ]
      },
      {
        id: 'risk-group',
        label: 'Risk Management',
        type: 'group',
        subItems: [
          { id: 'risk-plan', label: 'Risk Management Plan', type: 'document' },
          { id: 'identify-risk', label: 'Identify Risk', type: 'activity' },
          { id: 'qual-risk', label: 'Qualitative Risk Analysis', type: 'activity' },
          { id: 'quant-risk', label: 'Quantitative Risk Analysis', type: 'activity' },
          { id: 'risk-response', label: 'Define Risk Responses', type: 'activity' }
        ]
      },
      {
        id: 'procurement-group',
        label: 'Procurement',
        type: 'group',
        subItems: [
          { id: 'procurement-plan', label: 'Procurement Mgmt Plan', type: 'document' },
          { id: 'make-buy', label: 'Make or Buy Analysis', type: 'activity' }
        ]
      },
      {
        id: 'integrate',
        label: 'INTEGRATE: Project Management Plan',
        type: 'milestone'
      }
    ]
  },
  {
    id: 'execution',
    title: 'Execution',
    color: 'bg-red-100',
    borderColor: 'border-red-400',
    textColor: 'text-red-800',
    nodes: [
      {
        id: 'acquire-resources',
        label: 'Acquire Resources',
        type: 'activity'
      },
      {
        id: 'kick-off',
        label: 'Conduct Kick-off Meeting',
        type: 'milestone'
      },
      {
        id: 'do-work',
        label: 'Team Starts Doing Work',
        type: 'activity'
      },
      {
        id: 'exec-activities',
        label: 'PM Activities',
        type: 'group',
        subItems: [
          { id: 'manage-comms', label: 'Do Communication (CMP)', type: 'activity' },
          { id: 'manage-stakeholders', label: 'Engagement Strategies (SEP)', type: 'activity' },
          { id: 'implement-risk', label: 'Implement Risk Responses', type: 'activity' },
          { id: 'manage-quality', label: 'Manage Quality', type: 'activity' },
          { id: 'conduct-procurements', label: 'Procure Items', type: 'activity' },
          { id: 'manage-team', label: 'Develop & Manage Team', type: 'activity' },
          { id: 'lessons-learned', label: 'Document Lessons Learned', type: 'activity' }
        ]
      }
    ]
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Controlling',
    color: 'bg-blue-100',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-800',
    nodes: [
      {
        id: 'change-control',
        label: 'Handle Changes (Change Control)',
        type: 'activity'
      },
      {
        id: 'monitor-triple-constraint',
        label: 'Monitor Scope, Schedule, Cost, Quality, Resources',
        type: 'activity'
      },
      {
        id: 'monitor-risk',
        label: 'Monitor Risk',
        type: 'activity'
      },
      {
        id: 'monitor-comms',
        label: 'Monitor Communication & Engagement',
        type: 'activity'
      },
      {
        id: 'control-procurements',
        label: 'Monitor & Control Procurements',
        type: 'activity'
      }
    ]
  },
  {
    id: 'closure',
    title: 'Closure',
    color: 'bg-amber-100',
    borderColor: 'border-amber-400',
    textColor: 'text-amber-800',
    nodes: [
      {
        id: 'perform-closure',
        label: 'PERFORM ALL CLOSURE ACTIVITIES',
        type: 'milestone'
      }
    ]
  }
];
