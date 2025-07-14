# 🤖 So I built an HR chatbot and learned some things...

After playing around with that competitor analysis tool, I got curious about how AI agents actually decide which tools to use. So naturally, I built a chatbot for a made-up company called TechCorp! 😄

## Here's what I discovered:

**🔍 The search stuff worked way better than expected**
- Hooked it up to Vectorize.io for document search
- Getting solid 0.73+ relevance scores when people ask about HR policies
- It actually finds the right answers most of the time (who knew?)

**🧠 The decision-making is pretty cool**
The agent figures out whether to:
- Look up employee info ("Who's the marketing manager?")
- Search policy docs ("What's our sick leave policy?")
- Or mix both for trickier questions

**⚡ Backup plans are everything**
When the fancy vector search breaks, it just switches to basic mock data. No drama, keeps working.

**🤯 The tricky part**
Getting all the different APIs to play nice together was... an adventure. Environment variables are apparently very picky about line breaks (learned that the hard way).

## What I'm thinking about:

The agent doesn't just search - it actually *chooses* what to search based on what you're asking. That's the interesting bit. It's like having a coworker who knows whether to check the employee directory or the policy manual.

Built this whole thing as a learning exercise, but honestly? It's kind of satisfying when the AI pulls up the exact vacation policy you were looking for.

*TechCorp is totally fictional, btw - just needed some realistic HR data to play with!*

#AI #Agents #RAG #TechExperiments #LearningInPublic 