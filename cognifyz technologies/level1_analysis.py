import pandas as pd
import matplotlib.pyplot as plt

def main():
    print("========================================")
    print(" LEVEL 1 DATA ANALYSIS")
    print("========================================")
    
    # Load dataset
    try:
        df = pd.read_csv('dataset.csv')
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return

    # Task 1: Top Cuisines
    print("\n--- Task 1: Top Cuisines ---")
    
    # Drop rows with missing cuisines
    cuisines_df = df.dropna(subset=['Cuisines'])
    # Count occurrences of each cuisine (Note: Some restaurants have multiple cuisines separated by commas. 
    # For simplicity as per typical Level 1, we can either count combinations or individual cuisines.
    # The requirement says 'most common cuisines in the dataset', so splitting them is better.)
    all_cuisines = cuisines_df['Cuisines'].str.split(', ').explode()
    top_3_cuisines = all_cuisines.value_counts().head(3)
    
    print("Top 3 most common cuisines:")
    print(top_3_cuisines)
    
    total_restaurants = len(df)
    print("\nPercentage of restaurants serving each of the top cuisines:")
    for cuisine, count in top_3_cuisines.items():
        # Count restaurants that serve this cuisine (it could be one of multiple)
        restaurants_serving = cuisines_df['Cuisines'].str.contains(cuisine, na=False, regex=False).sum()
        percentage = (restaurants_serving / total_restaurants) * 100
        print(f"{cuisine}: {percentage:.2f}%")

    # Task 2: City Analysis
    print("\n--- Task 2: City Analysis ---")
    city_counts = df['City'].value_counts()
    highest_city = city_counts.idxmax()
    print(f"City with the highest number of restaurants: {highest_city} ({city_counts.max()} restaurants)")
    
    avg_rating_per_city = df.groupby('City')['Aggregate rating'].mean()
    print("\nAverage rating for restaurants in each city (Top 5 shown):")
    print(avg_rating_per_city.head())
    
    highest_rating_city = avg_rating_per_city.idxmax()
    print(f"\nCity with the highest average rating: {highest_rating_city} ({avg_rating_per_city.max():.2f})")

    # Task 3: Price Range Distribution
    print("\n--- Task 3: Price Range Distribution ---")
    price_counts = df['Price range'].value_counts().sort_index()
    print("Price range counts:")
    print(price_counts)
    
    plt.figure(figsize=(8, 5))
    price_counts.plot(kind='bar', color='skyblue', edgecolor='black')
    plt.title('Distribution of Price Ranges')
    plt.xlabel('Price Range')
    plt.ylabel('Number of Restaurants')
    plt.xticks(rotation=0)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.savefig('level1_price_range_distribution.png')
    print("Saved histogram as 'level1_price_range_distribution.png'")
    
    print("\nPercentage of restaurants in each price range category:")
    price_percentages = (price_counts / total_restaurants) * 100
    for price, pct in price_percentages.items():
        print(f"Price Range {price}: {pct:.2f}%")

    # Task 4: Online Delivery
    print("\n--- Task 4: Online Delivery ---")
    online_delivery_counts = df['Has Online delivery'].value_counts()
    has_online_delivery = online_delivery_counts.get('Yes', 0)
    percentage_online_delivery = (has_online_delivery / total_restaurants) * 100
    print(f"Percentage of restaurants with online delivery: {percentage_online_delivery:.2f}%")
    
    avg_rating_delivery = df.groupby('Has Online delivery')['Aggregate rating'].mean()
    print("\nAverage ratings:")
    print(f"With online delivery: {avg_rating_delivery.get('Yes', 'N/A'):.2f}")
    print(f"Without online delivery: {avg_rating_delivery.get('No', 'N/A'):.2f}")

if __name__ == '__main__':
    main()
