"use client";

/**
 * DomGuard prevents React from crashing with:
 * "NotFoundError: Failed to execute 'removeChild' on 'Node'"
 *
 * The patch is injected as a synchronous <script> in <head> so it runs
 * BEFORE React hydration, which is the only way to intercept the error.
 */
export default function DomGuard() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
(function(){
  if(typeof Node==='undefined')return;
  var _rc=Node.prototype.removeChild;
  Node.prototype.removeChild=function(c){
    if(c&&c.parentNode!==this){
      if(c.parentNode)try{return c.parentNode.removeChild(c)}catch(e){}
      return c;
    }
    return _rc.apply(this,arguments);
  };
  var _ib=Node.prototype.insertBefore;
  Node.prototype.insertBefore=function(n,r){
    if(r&&r.parentNode!==this){
      try{return this.appendChild(n)}catch(e){}
      return n;
    }
    return _ib.apply(this,arguments);
  };
})();
`,
      }}
    />
  );
}
