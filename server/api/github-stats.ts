import type { CopilotMetrics } from "@/model/Copilot_Metrics";
import { getMetricsData } from '../../shared/utils/metrics-util';

interface GitHubStats {
  totalIdeCodeCompletionUsers: number;
  totalIdeChatUsers: number;
  totalDotcomChatUsers: number;
  totalDotcomPRUsers: number;
  totalPRSummariesCreated: number;
  totalIdeCodeCompletionModels: number;
  totalIdeChatModels: number;
  totalDotcomChatModels: number;
  totalDotcomPRModels: number;
  ideCodeCompletionModels: any[];
  ideChatModels: any[];
  dotcomChatModels: any[];
  dotcomPRModels: any[];
  agentModeChartData: any; // Chart.js dataset object
  modelUsageChartData: any; // Chart.js dataset object
}

export default defineEventHandler(async (event) => {
  try {
    const metricsData = await getMetricsData(event);
    // Calculate GitHub.com statistics
    const stats = calculateGitHubStats(metricsData);
    return stats;
  } catch (error) {
    const logger = console;
    logger.error('Error in github-stats endpoint:', error);
    return new Response('Error fetching metrics data: ' + (error instanceof Error ? error.message : String(error)), { status: 500 });
  }
});

function calculateGitHubStats(metrics: CopilotMetrics[]): GitHubStats {
  // Calculate totals with optimized loops
  const totals = metrics.reduce((acc, metric) => {
    acc.totalIdeCodeCompletionUsers += metric.copilot_ide_code_completions?.total_engaged_users || 0;
    acc.totalIdeChatUsers += metric.copilot_ide_chat?.total_engaged_users || 0;
    acc.totalDotcomChatUsers += metric.copilot_dotcom_chat?.total_engaged_users || 0;
    acc.totalDotcomPRUsers += metric.copilot_dotcom_pull_requests?.total_engaged_users || 0;
    
    // Calculate PR summaries
    if (metric.copilot_dotcom_pull_requests?.repositories) {
      acc.totalPRSummariesCreated += metric.copilot_dotcom_pull_requests.repositories.reduce((repoSum, repo) => {
        return repoSum + (repo.models?.reduce((modelSum, model) => {
          return modelSum + (model.total_pr_summaries_created || 0);
        }, 0) || 0);
      }, 0);
    }
    
    return acc;
  }, {
    totalIdeCodeCompletionUsers: 0,
    totalIdeChatUsers: 0,
    totalDotcomChatUsers: 0,
    totalDotcomPRUsers: 0,
    totalPRSummariesCreated: 0
  });

  // Calculate unique models with optimized approach
  const modelSets = {
    ideCodeCompletion: new Set<string>(),
    ideChat: new Set<string>(),
    dotcomChat: new Set<string>(),
    dotcomPR: new Set<string>()
  };

  const modelMaps = {
    ideCodeCompletion: new Map(),
    ideChat: new Map(),
    dotcomChat: new Map(),
    dotcomPR: new Map()
  };

  // Single loop to process all metrics and models
  for (const metric of metrics) {
    // IDE Code Completions
    metric.copilot_ide_code_completions?.editors?.forEach(editor => {
      editor.models?.forEach(model => {
        modelSets.ideCodeCompletion.add(model.name);
        
        const key = `${model.name}-${editor.name}`;
        if (!modelMaps.ideCodeCompletion.has(key)) {
          modelMaps.ideCodeCompletion.set(key, {
            name: model.name,
            editor: editor.name,
            model_type: model.is_custom_model ? 'Custom' : 'Default',
            total_engaged_users: 0
          });
        }
        modelMaps.ideCodeCompletion.get(key).total_engaged_users += model.total_engaged_users;
      });
    });

    // IDE Chat
    metric.copilot_ide_chat?.editors?.forEach(editor => {
      editor.models?.forEach(model => {
        modelSets.ideChat.add(model.name);
        
        const key = `${model.name}-${editor.name}`;
        if (!modelMaps.ideChat.has(key)) {
          modelMaps.ideChat.set(key, {
            name: model.name,
            editor: editor.name,
            model_type: model.is_custom_model ? 'Custom' : 'Default',
            total_engaged_users: 0,
            total_chats: 0,
            total_chat_insertion_events: 0,
            total_chat_copy_events: 0
          });
        }
        const entry = modelMaps.ideChat.get(key);
        entry.total_engaged_users += model.total_engaged_users;
        entry.total_chats += model.total_chats;
        entry.total_chat_insertion_events += model.total_chat_insertion_events;
        entry.total_chat_copy_events += model.total_chat_copy_events;
      });
    });

    // Dotcom Chat
    metric.copilot_dotcom_chat?.models?.forEach(model => {
      modelSets.dotcomChat.add(model.name);
      
      if (!modelMaps.dotcomChat.has(model.name)) {
        modelMaps.dotcomChat.set(model.name, {
          name: model.name,
          model_type: model.is_custom_model ? 'Custom' : 'Default',
          total_engaged_users: 0,
          total_chats: 0
        });
      }
      const entry = modelMaps.dotcomChat.get(model.name);
      entry.total_engaged_users += model.total_engaged_users;
      entry.total_chats += model.total_chats;
    });

    // Dotcom PR
    metric.copilot_dotcom_pull_requests?.repositories?.forEach(repo => {
      repo.models?.forEach(model => {
        modelSets.dotcomPR.add(model.name);
        
        const key = `${model.name}-${repo.name}`;
        if (!modelMaps.dotcomPR.has(key)) {
          modelMaps.dotcomPR.set(key, {
            name: model.name,
            repository: repo.name,
            model_type: model.is_custom_model ? 'Custom' : 'Default',
            total_engaged_users: 0,
            total_pr_summaries_created: 0
          });
        }
        const entry = modelMaps.dotcomPR.get(key);
        entry.total_engaged_users += model.total_engaged_users;
        entry.total_pr_summaries_created += model.total_pr_summaries_created;
      });
    });
  }

  // Chart data
  const labels = metrics.map(metric => metric.date);
  const agentModeChartData = {
    labels,
    datasets: [
      {
        label: 'IDE Code Completions',
        data: metrics.map(metric => metric.copilot_ide_code_completions?.total_engaged_users || 0),
        borderColor: '#1f77b4',
        backgroundColor: 'rgba(31, 119, 180, 0.18)',
        pointBackgroundColor: '#1f77b4',
        pointBorderColor: '#fff',
        pointRadius: 3,
        tension: 0.25
      },
      {
        label: 'IDE Chat',
        data: metrics.map(metric => metric.copilot_ide_chat?.total_engaged_users || 0),
        borderColor: '#2ca02c',
        backgroundColor: 'rgba(44, 160, 44, 0.18)',
        pointBackgroundColor: '#2ca02c',
        pointBorderColor: '#fff',
        pointRadius: 3,
        tension: 0.25
      },
      {
        label: 'GitHub.com Chat',
        data: metrics.map(metric => metric.copilot_dotcom_chat?.total_engaged_users || 0),
        borderColor: '#9467bd',
        backgroundColor: 'rgba(148, 103, 189, 0.18)',
        pointBackgroundColor: '#9467bd',
        pointBorderColor: '#fff',
        pointRadius: 3,
        tension: 0.25
      },
      {
        label: 'GitHub.com PR',
        data: metrics.map(metric => metric.copilot_dotcom_pull_requests?.total_engaged_users || 0),
        borderColor: '#ff7f0e',
        backgroundColor: 'rgba(255, 127, 14, 0.18)',
        pointBackgroundColor: '#ff7f0e',
        pointBorderColor: '#fff',
        pointRadius: 3,
        tension: 0.25
      }
    ]
  };

  const modelUsageChartData = {
    labels: ['IDE Code Completions', 'IDE Chat', 'GitHub.com Chat', 'GitHub.com PR'],
    datasets: [
      {
        label: 'Total Models',
        data: [
          modelSets.ideCodeCompletion.size,
          modelSets.ideChat.size,
          modelSets.dotcomChat.size,
          modelSets.dotcomPR.size
        ],
        backgroundColor: [
          'rgba(31, 119, 180, 0.65)',
          'rgba(44, 160, 44, 0.65)',
          'rgba(148, 103, 189, 0.65)',
          'rgba(255, 127, 14, 0.65)'
        ],
        borderColor: [
          '#1f77b4',
          '#2ca02c',
          '#9467bd',
          '#ff7f0e'
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(31, 119, 180, 0.85)',
          'rgba(44, 160, 44, 0.85)',
          'rgba(148, 103, 189, 0.85)',
          'rgba(255, 127, 14, 0.85)'
        ],
        hoverBorderColor: [
          '#1f77b4',
          '#2ca02c',
          '#9467bd',
          '#ff7f0e'
        ]
      }
    ]
  };

  return {
    ...totals,
    totalIdeCodeCompletionModels: modelSets.ideCodeCompletion.size,
    totalIdeChatModels: modelSets.ideChat.size,
    totalDotcomChatModels: modelSets.dotcomChat.size,
    totalDotcomPRModels: modelSets.dotcomPR.size,
    ideCodeCompletionModels: Array.from(modelMaps.ideCodeCompletion.values()),
    ideChatModels: Array.from(modelMaps.ideChat.values()),
    dotcomChatModels: Array.from(modelMaps.dotcomChat.values()),
    dotcomPRModels: Array.from(modelMaps.dotcomPR.values()),
    agentModeChartData,
    modelUsageChartData
  };
}
