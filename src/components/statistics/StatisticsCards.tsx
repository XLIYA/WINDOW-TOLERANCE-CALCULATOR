import React from 'react';
import { Hash, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Statistics } from '@/types';

interface StatisticsCardsProps {
  statistics: Statistics;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({ statistics }) => {
  const cards = [
    {
      title: 'تعداد کل',
      value: statistics.total,
      icon: Hash,
      gradient: 'from-secondary to-secondary/80',
      iconBg: 'bg-secondary/10',
      iconColor: 'text-secondary',
      textColor: 'text-secondary'
    },
    {
      title: 'قبول شده',
      value: statistics.pass,
      icon: CheckCircle,
      gradient: 'from-success to-success/80',
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
      textColor: 'text-success'
    },
    {
      title: 'نیاز به بررسی',
      value: statistics.warning,
      icon: AlertCircle,
      gradient: 'from-warning to-warning/80',
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      textColor: 'text-warning'
    },
    {
      title: 'مردود',
      value: statistics.fail,
      icon: XCircle,
      gradient: 'from-destructive to-destructive/80',
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
      textColor: 'text-destructive'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className="relative overflow-hidden bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in border-2 border-border hover:border-opacity-60 group"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
          
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <span className={`text-3xl font-bold ${card.textColor} group-hover:scale-105 transition-transform duration-300`}>
                {card.value.toLocaleString()}
              </span>
            </div>
            
            <h3 className="text-sm font-bold text-foreground mb-3">{card.title}</h3>
            
            {statistics.total > 0 && (
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${card.gradient} h-2 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${(card.value / statistics.total) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {((card.value / statistics.total) * 100).toFixed(1)}% از کل
                </p>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-20 group-hover:opacity-40 transition-opacity duration-300 ${card.gradient}"></div>
        </div>
      ))}
    </div>
  );
};