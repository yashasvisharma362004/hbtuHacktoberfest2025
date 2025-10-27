class Solution {
    public void helper(int start,int n,int k,ArrayList<ArrayList<Integer>>ans,ArrayList<Integer>curr){
        if(curr.size() == k){
            if(n == 0){
            ans.add(new ArrayList<>(curr));
            }
            return;
        }
        for(int i=start;i<=9;i++){
            if(i > n)break;
            curr.add(i);
            helper(i+1,n-i,k,ans,curr);
            curr.remove(curr.size()-1);
        }
    }
    public ArrayList<ArrayList<Integer>> combinationSum(int n, int k) {
       ArrayList<ArrayList<Integer>>ans = new ArrayList<>();
        helper(1,n,k,ans,new ArrayList<>());
        return ans;
    }
}
