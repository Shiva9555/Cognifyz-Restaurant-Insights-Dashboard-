import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import re

def main():
    print("========================================")
    print(" LEVEL 3 DATA ANALYSIS")
    print("========================================")
    
    # Load dataset
    try:
        df = pd.read_csv('dataset.csv')
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return

    # Task 1: Restaurant Reviews
    print("\n--- Task 1: Restaurant Reviews ---")
    
    # Zomato dataset usually has 'Rating text' for reviews.
    if 'Rating text' in df.columns:
        reviews = df['Rating text'].dropna().str.lower()
        print(f"Analyzing {len(reviews)} review texts...")
        
        # very basic keyword analysis (positive vs negative) based on rating categories
        # A full sentiment analysis would require NLTK/Spacy, this is basic for internship level.
        positive_keywords = ['excellent', 'very good', 'good']
        negative_keywords = ['poor', 'average', 'not rated']  # "average" might be considered neutral/negative
        
        rating_counts = df['Rating text'].value_counts()
        print("\nDistribution of Rating Text (Keywords):")
        print(rating_counts)
        
        # Avg length of reviews: Here 'Rating text' is just one or two words (e.g. 'Good', 'Excellent').
        # If there's an actual review text column like 'Review', we would use that.
        # Check if another column looks like reviews.
        review_col = 'Rating text'
        df['Review length'] = df[review_col].astype(str).str.len()
        avg_len = df['Review length'].mean()
        print(f"\nAverage length of '{review_col}': {avg_len:.2f} characters")
        
        # Relationship between review length and rating
        # We can see correlation or simply group by
        avg_len_by_rating = df.groupby('Aggregate rating')['Review length'].mean()
        print("For single-word rating texts, length correlation isn't very meaningful, but correlation coefficient is:")
        correlation = df['Review length'].corr(df['Aggregate rating'])
        print(f"Correlation between Review Length and Rating: {correlation:.4f}")
    else:
        print("No text reviews column found.")

    # Task 2: Votes Analysis
    print("\n--- Task 2: Votes Analysis ---")
    
    highest_votes_restaurant = df.loc[df['Votes'].idxmax()]
    print(f"Restaurant with highest votes:")
    print(f"- Name: {highest_votes_restaurant['Restaurant Name']}")
    print(f"- Votes: {highest_votes_restaurant['Votes']}")
    print(f"- Rating: {highest_votes_restaurant['Aggregate rating']}")
    
    lowest_votes_restaurant = df.loc[df['Votes'].idxmin()]
    print(f"\nRestaurant with lowest votes:")
    # There could be many with 0 votes, so idxmin finds the first one.
    zero_votes_count = (df['Votes'] == 0).sum()
    print(f"- Name: {lowest_votes_restaurant['Restaurant Name']}")
    print(f"- Votes: {lowest_votes_restaurant['Votes']} (There are {zero_votes_count} restaurants with 0 votes)")
    print(f"- Rating: {lowest_votes_restaurant['Aggregate rating']}")
    
    votes_rating_corr = df['Votes'].corr(df['Aggregate rating'])
    print(f"\nCorrelation between Number of Votes and Aggregate Rating: {votes_rating_corr:.4f}")
    if votes_rating_corr > 0.5:
        print("Conclusion: There is a strong positive correlation. Higher rated restaurants tend to have more votes.")
    elif votes_rating_corr > 0.2:
        print("Conclusion: There is a weak positive correlation between votes and rating.")
    else:
        print("Conclusion: There is minimal to no correlation.")

    # Task 3: Price Range vs Services
    print("\n--- Task 3: Price Range vs. Services ---")
    
    plt.figure(figsize=(10, 5))
    
    # Online Delivery
    plt.subplot(1, 2, 1)
    sns.countplot(data=df, x='Price range', hue='Has Online delivery', palette='Blues')
    plt.title('Online Delivery by Price Range')
    
    # Table Booking
    plt.subplot(1, 2, 2)
    sns.countplot(data=df, x='Price range', hue='Has Table booking', palette='Greens')
    plt.title('Table Booking by Price Range')
    
    plt.tight_layout()
    plt.savefig('level3_price_range_services.png')
    print("Saved plots as 'level3_price_range_services.png'")
    
    print("\nPercentage offering services by Price Range:")
    for price in sorted(df['Price range'].unique()):
        subset = df[df['Price range'] == price]
        delivery_pct = (subset['Has Online delivery'] == 'Yes').mean() * 100
        booking_pct = (subset['Has Table booking'] == 'Yes').mean() * 100
        print(f"Price Range {price}:")
        print(f"  - Online Delivery: {delivery_pct:.2f}%")
        print(f"  - Table Booking:   {booking_pct:.2f}%")
        
    print("\nAnalysis Overview: As price range increases, restaurants are generally more likely to offer table bookings.")

if __name__ == '__main__':
    main()
