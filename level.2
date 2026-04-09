import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def main():
    print("========================================")
    print(" LEVEL 2 DATA ANALYSIS")
    print("========================================")
    
    # Load dataset
    try:
        df = pd.read_csv('dataset.csv')
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return

    # Task 1: Restaurant Ratings
    print("\n--- Task 1: Restaurant Ratings ---")
    plt.figure(figsize=(8, 5))
    df['Aggregate rating'].plot(kind='hist', bins=20, color='lightgreen', edgecolor='black')
    plt.title('Distribution of Aggregate Ratings')
    plt.xlabel('Rating')
    plt.ylabel('Frequency')
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.savefig('level2_ratings_distribution.png')
    print("Saved ratings histogram as 'level2_ratings_distribution.png'")
    
    # Let's say rating ranges are bins of size 1 (0-1, 1-2, etc.) or just taking the value_counts using cut
    bins = [0, 1, 2, 3, 4, 5]
    labels = ['0-1', '1-2', '2-3', '3-4', '4-5']
    df['Rating range'] = pd.cut(df['Aggregate rating'], bins=bins, labels=labels, include_lowest=True)
    common_rating_range = df['Rating range'].value_counts().idxmax()
    print(f"Most common rating range: {common_rating_range}")
    
    avg_votes = df['Votes'].mean()
    print(f"Average number of votes received by restaurants: {avg_votes:.2f}")

    # Task 2: Cuisine Combination
    print("\n--- Task 2: Cuisine Combination ---")
    cuisine_combos = df['Cuisines'].value_counts()
    most_common_combo = cuisine_combos.idxmax()
    print(f"Most common cuisine combination: '{most_common_combo}' with {cuisine_combos.max()} occurrences.")
    
    # Let's look at the top 10 combinations and see if they have higher ratings
    top_10_combos = cuisine_combos.head(10).index
    df_top_combos = df[df['Cuisines'].isin(top_10_combos)]
    avg_rating_per_combo = df_top_combos.groupby('Cuisines')['Aggregate rating'].mean().sort_values(ascending=False)
    print("\nAverage rating for the top 10 most common cuisine combinations:")
    print(avg_rating_per_combo)

    # Task 3: Geographic Analysis
    print("\n--- Task 3: Geographic Analysis ---")
    # Identify obvious outliers or invalid lat/long like 0.0
    geo_df = df[(df['Latitude'] != 0.0) & (df['Longitude'] != 0.0)].dropna(subset=['Latitude', 'Longitude'])
    
    plt.figure(figsize=(10, 6))
    sns.scatterplot(x='Longitude', y='Latitude', data=geo_df, alpha=0.5, hue='Aggregate rating', palette='viridis', size='Aggregate rating')
    plt.title('Geographic Distribution of Restaurants')
    plt.xlabel('Longitude')
    plt.ylabel('Latitude')
    plt.savefig('level2_geographic_distribution.png')
    print("Saved geographic plot as 'level2_geographic_distribution.png'")
    print(f"Plotted {len(geo_df)} valid restaurant locations out of {len(df)} total.")

    # Task 4: Restaurant Chains
    print("\n--- Task 4: Restaurant Chains ---")
    restaurant_counts = df['Restaurant Name'].value_counts()
    chains = restaurant_counts[restaurant_counts > 1]
    
    if len(chains) > 0:
        print(f"Identified {len(chains)} restaurant chains (restaurants with >1 location).")
        top_chains = chains.head(5)
        print("\nTop 5 Restaurant Chains by number of outlets:")
        print(top_chains)
        
        # Analyze average rating and total votes for top 5 chains
        print("\nMetrics for Top 5 Chains:")
        for chain in top_chains.index:
            chain_data = df[df['Restaurant Name'] == chain]
            avg_rating = chain_data['Aggregate rating'].mean()
            total_votes = chain_data['Votes'].sum()
            print(f"- {chain}: {len(chain_data)} outlets | Avg Rating: {avg_rating:.2f} | Total Votes: {total_votes}")
    else:
        print("No restaurant chains identified.")

if __name__ == '__main__':
    main()
